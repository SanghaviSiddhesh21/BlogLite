from datetime import datetime,date,timedelta
import os,io,csv
import base64,json
import re,math,random

from flask import Flask, redirect,render_template, request, session,url_for,Response,make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin,login_user,LoginManager,login_required,logout_user,current_user
from flask_bcrypt import Bcrypt
from flask_mail import Mail,Message
from sqlalchemy import func,desc
from flask_restful import Resource,Api,reqparse
from flask_cors import CORS
from celery import Celery
from celery.schedules import crontab
import pdfkit
import numpy as np
import matplotlib.pyplot as plt

current_dir=os.path.abspath(os.path.dirname(__file__))
app=Flask(__name__)
bcrypt=Bcrypt(app)
mail = Mail(app)

app.config['SQLALCHEMY_DATABASE_URI']="sqlite:///"+os.path.join(current_dir,"main.sqlite3")
app.config['SECRET_KEY']='thisismysecretkey'
db=SQLAlchemy(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME']='Youremailid'
app.config['MAIL_PASSWORD']='Your authenticationkey'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER']='Youremailid'
mail = Mail(app)
api=Api(app)
CORS(app)

app.config['CELERY_BROKER_URL'] ='redis://localhost:6379'
app.config['CELERY_RESULT_BACKEND'] ='redis://localhost:6379'
app.config['TIMEZONE']='Asia/Calcutta'
def make_celery(app):
    celery = Celery(
        "app",
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery
celery = make_celery(app)

login_manager=LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(id):
  return User_table.query.get(int(id))

class User_table(db.Model,UserMixin):
  __tablename__='user_table'
  id=db.Column(db.Integer,primary_key=True,autoincrement=True)
  fname=db.Column(db.String,nullable=False)
  lname=db.Column(db.String,nullable=False)
  emailid=db.Column(db.String,nullable=False)
  username=db.Column(db.String(20),nullable=False,unique=True)
  password=db.Column(db.String(80),nullable=False)
  dob=db.Column(db.Date,nullable=False)
  profileImage=db.Column(db.String,nullable=False)
  dateofjoining=db.Column(db.Date,nullable=False)
  lastlogin=db.Column(db.Date,nullable=False)
  # lists=db.relationship('Posts',backref='user')
  # cards=db.relationship('Follows',backref='user')
class Posts(db.Model):
  __tablename__="posts"
  id=db.Column(db.Integer,primary_key=True,autoincrement=True)
  post=db.Column(db.String,nullable=False)
  title=db.Column(db.String,nullable=False)
  description=db.Column(db.String,nullable=False)
  uid=db.Column(db.Integer,db.ForeignKey('user_table.id'))
  dateposted=db.Column(db.Date,nullable=False)
class Follows(db.Model):
  __tablename__="follows"
  id=db.Column(db.Integer,primary_key=True,autoincrement=True)
  follower=db.Column(db.Integer,db.ForeignKey('user_table.id'))
  followee=db.Column(db.Integer,db.ForeignKey('user_table.id'))
  dateoffollowing=db.Column(db.Date,nullable=False)

def checkemail(email):
  regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
  if(re.fullmatch(regex, email)):
      return 'true'
  else:
      return 'false'

reg_otp={}
def send_otp(email):
  #print('Inside emailfunction')
  digits = "0123456789"
  OTP = ""
  for i in range(6) :
        OTP += digits[math.floor(random.random() * 10)]
  message_to_send=f"<b>{OTP}</b>"

  msg = Message("Your Registeration OTP")
  msg.recipients=[email]
  msg.html=message_to_send
  mail.send(msg)
  reg_otp[email]=OTP
  return 'true'

def profileavatar():
  with open("static\profileavatar\profileavatar.jpg", "rb") as img_file:
      my_string = base64.b64encode(img_file.read())
  return(my_string)

@app.route('/',methods=['GET','POST'])
def login():
  if request.method=='GET':
    return render_template('login.html')
  elif request.method=='POST':
      (username,password)=(request.form['login-username'],request.form['login-password'])
      logindata=[{'login-username':username,'login-password':password}]
      print(username,password)
      if username:
        if password:
          user=User_table.query.filter_by(username=username).first()
          print(user)
          if user is None:
            return render_template('Login.html',datapassed='true',usernotfound='true',data=logindata)
          else:
            #hashedpassword=bcrypt.generate_password_hash(password)
            if bcrypt.check_password_hash(user.password,password):
              login_user(user)
              # user.lastlogin=date.today()
              # try:
              #   db.session.flush()        
              # except Exception as error:
              #   #print('except 1 done')
              #   db.session.rollback()
              # db.session.commit()
              # db.session.close()
              return redirect(url_for('dashboard'))
            else:
              return render_template('Login.html',datapassed='true',incorrectpassword='true',data=logindata)
        else:
          return render_template('Login.html',datapassed='true',passwordnotentered='true',data=logindata)
      else:
        return render_template('Login.html',datapassed='true',usernotentered='true',data=logindata)
      
@app.route('/Registeration',methods=['GET','POST'])
def registeration():
  if request.method=='GET':
    return render_template('registeration.html')
  elif request.method=='POST':
    (fname,lname,dob,email,username,password,repass,otp)=(request.form['firstname'],request.form['lastname'],request.form['dob'],request.form['emailid'],request.form['registeration-username'],request.form['registeration-password'],request.form['registeration-repassword'],request.form['OTP'])
    #print(fname,lname,dob,email,username,password,repass)
    userdata=[{'firstname':fname,'lastname':lname,'dob':dob,'emailid':email,'registeration-username':username,'registeration-password':password,'registeration-repassword':repass}]
    if fname:
      if lname:
        if dob:
          if email:
            if username:
              if password:
                if repass:
                  if checkemail(email)!='true':
                    return render_template('registeration.html',datapassed='true',invalidEmailid='true',data=userdata)
                  if password!=repass:
                    return render_template('registeration.html',datapassed='true',incorrectPassword='true',data=userdata)
                  userexist=User_table.query.filter_by(username=username).first()
                  #print("Pass 1 done")
                  if userexist:
                    return render_template('registeration.html',datapassed='true',invalidUsername='true',data=userdata)
                  emailexists=User_table.query.filter_by(emailid=email).first()
                  if emailexists:
                    return render_template('registeration.html',datapassed='true',mailAlreadyExists='true',data=userdata)
                  else:
                    if otp=="******":
                      if(send_otp(email)=='true'):
                        return render_template('registeration.html',datapassed='true',otpsend='true',data=userdata)
                      else:
                        return render_template('registeration.html',datapassed='true',generalerror="Error in sendgin OTP",data=userdata)
                    else:
                      if(otp.isnumeric() and len(otp)==6):
                        #print(reg_otp[email])
                        if(reg_otp[email]==otp):
                          #print('OTP Validation Successful')
                          del reg_otp[email]
                          hashedpassword=bcrypt.generate_password_hash(password)
                          dob=datetime.strptime(dob,'%Y-%m-%d')
                          profileImage=profileavatar()
                          today=date.today()
                          new_user=User_table(fname=fname,lname=lname,emailid=email,username=username,password=hashedpassword,dob=dob,profileImage=profileImage,dateofjoining=today,lastlogin=today)
                          try:
                            db.session.add(new_user)
                            db.session.flush()        
                          except Exception as error:
                            #print('except 1 done')
                            db.session.rollback()
                            return render_template('registeration.html',datapassed='true',generalerror="Cannot login at this point please try again later",data=userdata)
                          db.session.commit()
                          db.session.close()
                          return redirect(url_for('login'))
                        else:
                          #print('OTP Validation unuccessful')
                          return render_template('registeration.html',datapassed='true',otpsend='true',otperror='true',data=userdata)
                      else:
                        return render_template('registeration.html',datapassed='true',otpsend='true',otperror='true',data=userdata)
                else:
                  return render_template('registeration.html',datapassed='true',repasswordnotfound='true',data=userdata)
              else:
                return render_template('registeration.html',datapassed='true',passwordnotfound='true',data=userdata)
            else:
              return render_template('registeration.html',datapassed='true',usernamenotfound='true',data=userdata)
          else:
            return render_template('registeration.html',datapassed='true',emailnotfound='true',data=userdata)
        else:
          return render_template('registeration.html',datapassed='true',dobnotfound='true',data=userdata)
      else:
        return render_template('registeration.html',datapassed='true',lnamenotfound='true',data=userdata)
    else:
      return render_template('registeration.html',datapassed='true',fnamenotfound='true',data=userdata)

@app.route('/Dashboard',methods=['GET','POST'])
@login_required
def dashboard():
  if request.method=='GET':
    #print(current_user.id)
    return render_template("dashboard.html",userid=current_user.id)

@app.route('/Export',methods=['GET'])
@login_required
def export():
  if request.method=='GET':
    #print(current_user.id)
    userid=current_user.id
    post=Posts.query.with_entities(Posts.title,Posts.description,Posts.dateposted,Posts.post).filter_by(uid=userid).all()
    output=io.StringIO()
    writer=csv.writer(output)
    writer.writerow(['Post Title','Post Caption','Posted on','Base64 String'])
    if(post):
      for i in post:
        writer.writerow(i)
    output.seek(0)
    return Response(output,mimetype="text/csv",headers={"Content-Disposition":f"attachment;filename=Allposts.csv"})

@app.route('/Logout',methods=['GET','POST'])
@login_required
def logout():
  if request.method=='GET':
    user=User_table.query.filter_by(id=current_user.id).first()
    if(user):
      user.lastlogin=date.today()
      try:
        db.session.flush()        
      except Exception as error:
        #print('except 1 done')
        db.session.rollback()
      db.session.commit()
      db.session.close()
      logout_user()
      return redirect(url_for('login'))
    else:
      return redirect(url_for('dashboard'))
  

class newfeedAPI(Resource):
  def get(self,userid):
    #print(userid)
    if(userid.isnumeric()):
      #print(userid)
      userid=int(userid)
      user=User_table.query.with_entities(User_table.lastlogin).filter_by(id=userid).first()
      if(user):
        userlastlogin=user[0]
        #print(userlastlogin)
        alluserfollows=Follows.query.with_entities(Follows.followee).filter_by(follower=userid).all()
        alluserfollowslist=[]
        if(alluserfollows):
          for i in alluserfollows:
            alluserfollowslist.append(i[0])
        #print(alluserfollowslist)
        rawfeed=[]
        posts=Posts.query.with_entities(Posts.uid,User_table.username,Posts.post,Posts.title,Posts.description,Posts.dateposted).join(User_table,User_table.id==Posts.uid).filter(Posts.dateposted.between(userlastlogin,date.today())).order_by(Posts.dateposted).all()
        for i in posts:
          if i[0] in alluserfollowslist:
            rawfeed.append(i)
        finishedfeed=[]
        for i in rawfeed:
          finishedfeed.append({'followerid':i[0],'followerusername':i[1],'postpic':i[2],'posttitle':i[3],'postcaption':i[4],'dateposted':str(i[5])})
        return(finishedfeed)

      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})


createpost=reqparse.RequestParser()
createpost.add_argument('userid')
createpost.add_argument('posttitle')
createpost.add_argument('postcaption')
createpost.add_argument('postpic')
class createpostAPI(Resource):
  def post(self):
    args=createpost.parse_args()
    userid=args.get('userid',None)
    posttitle=args.get('posttitle',None)
    postcaption=args.get('postcaption',None)
    postpic=args.get('postpic',None)
    if(userid != None and userid.isnumeric()):
      userid=int(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        dateposted=date.today()
        new_post=Posts(post=postpic,title=posttitle,description=postcaption,uid=userid,dateposted=dateposted)
        try:
          db.session.add(new_post)
          db.session.flush()
        except Exception as error:
          db.session.rollback()
          print(error)
          return ({'Status':'Unsuccesful'})
        db.session.commit()
        db.session.close()
        return ({'Status':'Succesful'})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})


class userprofileAPI(Resource):
  def get(self,userid):
    if(userid.isnumeric()):
      #print(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        userposts=Posts.query.with_entities(Posts.id,Posts.post,Posts.title,Posts.description).filter_by(uid=userid).order_by(desc(Posts.dateposted)).all()
        ###If possible add descending order feature in the user profiletab
        final={}
        posts=[]
        totalposts=0
        if(userposts):
          for i in userposts:
            indiviualpost={'postid':i[0],'postpic':i[1],'posttitle':i[2],'postcaption':i[3]}
            totalposts=totalposts+1
            posts.append(indiviualpost)
        following=len(Follows.query.filter_by(follower=userid).all())
        follower=len(Follows.query.filter_by(followee=userid).all())
        profilepic=User_table.query.with_entities(User_table.username,User_table.profileImage).filter_by(id=userid).first()
        #print(profilepic)
        final['username']=profilepic[0]
        if(type(profilepic[1])==type('str')):
          final['profilepic']=profilepic[1]
        else:
          final['profilepic']=profilepic[1].decode('utf-8')
        final['totalposts']=totalposts
        final['following']=following
        final['follower']=follower
        final['posts']=posts
        #print(following,follower)
        return final
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})

class preeditpostAPI(Resource):
  def get(self,postid):
    if(postid.isnumeric()):
      post=Posts.query.with_entities(Posts.post,Posts.title,Posts.description).filter_by(id=postid).first()
      preeditinfo=[]
      if(post):
        preeditinfo.append({'posttitle':post[1],'postcaption':post[2],'postpic':post[0]})
      return(preeditinfo)
      
    else:
      return ({'EOO1':'True'})

editwithimagepost=reqparse.RequestParser()
editwithimagepost.add_argument('userid')
editwithimagepost.add_argument('postid')
editwithimagepost.add_argument('posttitle')
editwithimagepost.add_argument('postcaption')
editwithimagepost.add_argument('postpic')
class editwithImageAPI(Resource):
  def post(self):
    args=editwithimagepost.parse_args()
    userid=args.get('userid',None)
    postid=args.get('postid',None)
    posttitle=args.get('posttitle',None)
    postcaption=args.get('postcaption',None)
    postpic=args.get('postpic',None)
    if(userid != None and userid.isnumeric() and postid != None and postid.isnumeric()):
      postid=int(postid)
      userid=int(userid)
      post=Posts.query.filter_by(id=postid,uid=userid).first()
      if(post):
        dateposted=date.today()
        post.post=postpic
        post.title=posttitle
        post.description=postcaption
        post.dateposted=dateposted
        try:
          db.session.add(post)
          db.session.flush()
        except Exception as error:
          db.session.rollback()
          print(error)
          return ({'Status':'Unsuccesful'})
        db.session.commit()
        db.session.close()
        return ({'Status':'Succesful'})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})
    
editwithoutimagepost=reqparse.RequestParser()
editwithoutimagepost.add_argument('userid')
editwithoutimagepost.add_argument('postid')
editwithoutimagepost.add_argument('posttitle')
editwithoutimagepost.add_argument('postcaption')

deleteimage=reqparse.RequestParser()
deleteimage.add_argument('userid')
deleteimage.add_argument('postid')

class editwithoutImageAPI(Resource):
  def post(self):
    args=editwithoutimagepost.parse_args()
    userid=args.get('userid',None)
    postid=args.get('postid',None)
    posttitle=args.get('posttitle',None)
    postcaption=args.get('postcaption',None)
    if(userid != None and userid.isnumeric() and postid != None and postid.isnumeric()):
      postid=int(postid)
      userid=int(userid)
      post=Posts.query.filter_by(id=postid,uid=userid).first()
      if(post):
        dateposted=date.today()
        post.title=posttitle
        post.description=postcaption
        post.dateposted=dateposted
        try:
          db.session.add(post)
          db.session.flush()
        except Exception as error:
          db.session.rollback()
          print(error)
          return ({'Status':'Unsuccesful'})
        db.session.commit()
        db.session.close()
        return ({'Status':'Succesful'})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})
  def delete(self):
    args=editwithoutimagepost.parse_args()
    userid=args.get('userid',None)
    postid=args.get('postid',None)
    if(userid != None and userid.isnumeric() and postid != None and postid.isnumeric()):
      postid=int(postid)
      userid=int(userid)
      post=Posts.query.filter_by(id=postid,uid=userid).first()
      if(post):
        try:
          db.session.delete(post)
          db.session.flush()
        except Exception as error:
          db.session.rollback()
          print(error)
          return ({'Status':'Unsuccesful'})
        db.session.commit()
        db.session.close()
        return ({'Status':'Succesful'})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})


searchstring=reqparse.RequestParser()
searchstring.add_argument('userid')
searchstring.add_argument('regexstring')
class searchAPI(Resource):
  def post(self):
    args=searchstring.parse_args()
    userid=args.get('userid',None)
    regexstring=args.get('regexstring',None)
    if(userid != None and userid.isnumeric()):
      userid=int(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        allusers=User_table.query.with_entities(User_table.id,User_table.username).all()
        matchedusers=[]
        for i in allusers:
          if re.search(regexstring.lower(),i[1].lower()):
            matchedusers.append(list(i))
        #print(matchedusers) # => [[4, 'Pratik'], [3, 'Riyansh'], [2, 'Siddhesh']]
        unfollowmatchedusers=[]
        followmatchedusers=[]
        for i in matchedusers:
          following=Follows.query.filter_by(followee=i[0],follower=userid).first()
          if(following):
            unfollowmatchedusers.append({'userid':i[0],'username':i[1]})
          else:
            followmatchedusers.append({'userid':i[0],'username':i[1]})
        #print(unfollowmatchedusers)
        #print(followmatchedusers)
        return({'tounfollow':unfollowmatchedusers,'tofollow':followmatchedusers})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})
    
followuser=reqparse.RequestParser()
followuser.add_argument('userid')
followuser.add_argument('followerid')

unfollowuser=reqparse.RequestParser()
unfollowuser.add_argument('userid')
unfollowuser.add_argument('followingid')

class followuserAPI(Resource):
  def post(self):
    args=followuser.parse_args()
    userid=args.get('userid',None)
    followerid=args.get('followerid',None)
    if(userid != None and userid.isnumeric() and followerid != None and followerid.isnumeric()):
      userid=int(userid)
      followerid=int(followerid)
      user=User_table.query.filter_by(id=userid).first()
      follower=User_table.query.filter_by(id=followerid).first()
      if(user and follower):
        dateposted=date.today()
        newfollow=Follows(follower=userid,followee=followerid,dateoffollowing=dateposted)
        try:
          db.session.add(newfollow)
          db.session.flush()
        except Exception as error:
          db.session.rollback()
          print(error)
          return ({'Status':'Unsuccessful'})
        db.session.commit()
        db.session.close()
        return ({'Status':'Successful'}) 
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})
  def delete(self):
    args=unfollowuser.parse_args()
    userid=args.get('userid',None)
    followingid=args.get('followingid',None)
    if(userid != None and userid.isnumeric() and followingid != None and followingid.isnumeric()):
      userid=int(userid)
      followingid=int(followingid)
      user=User_table.query.filter_by(id=userid).first()
      follower=User_table.query.filter_by(id=followingid).first()
      if(user and follower):
        deletefollow=Follows.query.filter_by(follower=userid,followee=followingid).first()
        if(deletefollow):
          try:
            db.session.delete(deletefollow)
            db.session.flush()
          except Exception as error:
            db.session.rollback()
            print(error)
            return ({'Status':'Unsuccessful'})
          db.session.commit()
          db.session.close()
          return ({'Status':'Successful'}) 
        return({'Status':'Unsuccessful'})
      else:
        return({'E002':'True'})
    else:
      return({'E001':'True'})

class userfollowingAPI(Resource):
  def get(self,userid):
    #print(userid)
    if(userid.isnumeric()):
      #print(userid)
      userid=int(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        following=Follows.query.with_entities(Follows.followee).filter_by(follower=userid).all()
        #print(following) #=> [(3,), (4,), (2,)]
        followinglist=[]
        for i in following:
          followingexists=User_table.query.with_entities(User_table.username).filter_by(id=i[0]).first()
          #print(followingexists)
          if(followingexists):
            followinglist.append({'followingid':i[0],'username':followingexists[0]})
        return (followinglist)
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})

class userfollowersAPI(Resource):
  def get(self,userid):
    #print(userid)
    if(userid.isnumeric()):
      #print(userid)
      userid=int(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        followers=Follows.query.with_entities(Follows.follower).filter_by(followee=userid).all()
        followingfollowers=[] #=> Whom you can follow
        unfollowingfollowers=[] #=> Whom you can unfollow
        for i in followers:
          usernameget=User_table.query.with_entities(User_table.username).filter_by(id=i[0]).first()
          if(usernameget):
            following=Follows.query.with_entities(Follows.id).filter_by(follower=userid,followee=i[0]).first()
            if(following):
              unfollowingfollowers.append({'userid':i[0],'username':usernameget[0]})
            else:
              followingfollowers.append({'userid':i[0],'username':usernameget[0]})
        finallist={'canfollow':followingfollowers,'canunfollow':unfollowingfollowers}
        return (finallist)
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})

class otheruserprofileAPI(Resource):
  def get(self,userid):
    if(userid.isnumeric()):
      #print(userid)
      user=User_table.query.filter_by(id=userid).first()
      if(user):
        userposts=Posts.query.with_entities(Posts.id,Posts.post,Posts.title,Posts.description).filter_by(uid=userid).order_by(desc(Posts.dateposted)).all()
        ###If possible add descending order feature in the user profiletab
        final={}
        posts=[]
        totalposts=0
        if(userposts):
          for i in userposts:
            indiviualpost={'postid':i[0],'postpic':i[1],'posttitle':i[2],'postcaption':i[3]}
            totalposts=totalposts+1
            posts.append(indiviualpost)
        following=len(Follows.query.filter_by(follower=userid).all())
        follower=len(Follows.query.filter_by(followee=userid).all())
        profilepic=User_table.query.with_entities(User_table.username,User_table.profileImage).filter_by(id=userid).first()
        #print(profilepic)
        final['username']=profilepic[0]
        if(type(profilepic[1])==type('str')):
          final['profilepic']=profilepic[1]
        else:
          final['profilepic']=profilepic[1].decode('utf-8')
        final['totalposts']=totalposts
        final['following']=following
        final['follower']=follower
        final['posts']=posts
        #print(following,follower)
        return final
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})

editpersonaldetails=reqparse.RequestParser()
editpersonaldetails.add_argument('fname')
editpersonaldetails.add_argument('lname')
editpersonaldetails.add_argument('username')
editpersonaldetails.add_argument('profilepic')

class personaldetailsAPI(Resource):
  def get(self,userid):
    if(userid.isnumeric()):
      #print(userid)
      user=User_table.query.with_entities(User_table.profileImage,User_table.fname,User_table.lname,User_table.dob,User_table.username).filter_by(id=userid).first()
      if(user):
        final={}
        if(type(user[0])==type('str')):
          return({'profilepic':user[0],'firstname':user[1],'lastname':user[2],'dateofbirth':str(user[3]),'username':user[4]})
        else:
          return({'profilepic':user[0].decode('utf-8'),'firstname':user[1],'lastname':user[2],'dateofbirth':str(user[3]),'username':user[4]})
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})
  def put(self,userid):
    args=editpersonaldetails.parse_args()
    fname=args.get('fname',None)
    lname=args.get('lname',None)
    username=args.get('username',None)
    profilepic=args.get('profilepic',None)
    if(userid.isnumeric()):
      #print(userid)
      user=User_table.query.with_entities(User_table.profileImage).filter_by(id=userid).first()
      if(user):
        if(user[0]!=profilepic):
          user_edit=User_table.query.filter_by(id=userid).first()
          user_edit.fname=fname
          user_edit.lname=lname
          user_edit.username=username
          user_edit.profileImage=profilepic
          try:
            db.session.add(user_edit)
            db.session.flush()
          except Exception as error:
            db.session.rollback()
            print(error)
            return ({'Status':'Unsuccesful'})
          db.session.commit()
          db.session.close()
          return ({'Status':'Succesful'})
      else:
        return({'E002':'True'})
    else:
      return ({'EOO1':'True'})



    
api.add_resource(newfeedAPI,'/api/newfeed/<string:userid>')
api.add_resource(createpostAPI,'/api/createpost')
api.add_resource(userprofileAPI,'/api/userprofile/<string:userid>')
api.add_resource(preeditpostAPI,'/api/preeditpost/<string:postid>')
api.add_resource(editwithImageAPI,'/api/editpostwithimage')
api.add_resource(editwithoutImageAPI,'/api/editpostwithoutimage')
api.add_resource(searchAPI,'/api/searched')
api.add_resource(followuserAPI,'/api/followuser')
api.add_resource(userfollowingAPI,'/api/usersfollowing/<string:userid>')
api.add_resource(userfollowersAPI,'/api/usersfollowers/<string:userid>')
api.add_resource(otheruserprofileAPI,'/api/otheruserprofile/<string:userid>')
api.add_resource(personaldetailsAPI,'/api/personaldetails/<string:userid>')


@celery.task()
def dailyemails():
  user=User_table.query.with_entities(User_table.id,User_table.emailid,User_table.username).all()
  #print(user) #=>[(4, 'Pratik'), (3, 'Riyansh'), (2, 'Siddhesh123')]
  for i in user:
    post=Posts.query.filter_by(dateposted=date.today(),uid=i[0]).first()
    if(post):
      pass
    else:
      msg = Message("Remember me?")
      msg.recipients=[i[1]]
      msg.html=render_template('dailyreminders.html',username=i[2])
      mail.send(msg)
      print('Send')

@celery.task()
def montlyemails():
  user=User_table.query.with_entities(User_table.id,User_table.emailid,User_table.username).all()
  for i in user:
    follows_minus4=len(Follows.query.with_entities(Follows.id).filter(Follows.dateoffollowing.between(date.today()-timedelta(days=124),date.today()-timedelta(days=93)),Follows.followee==i[0]).all())
    follows_minus3=len(Follows.query.with_entities(Follows.id).filter(Follows.dateoffollowing.between(date.today()-timedelta(days=92),date.today()-timedelta(days=61)),Follows.followee==i[0]).all())
    follows_minus2=len(Follows.query.with_entities(Follows.id).filter(Follows.dateoffollowing.between(date.today()-timedelta(days=60),date.today()-timedelta(days=30)),Follows.followee==i[0]).all())
    follows_minus1=len(Follows.query.with_entities(Follows.id).filter(Follows.dateoffollowing.between(date.today()-timedelta(days=29),date.today()),Follows.followee==i[0]).all())
    if(follows_minus4==0):
      percentfollows_43='N/A'
    else:
      percentfollows_43=((follows_minus3-follows_minus4)/follows_minus4)
    if(follows_minus3==0):
      percentfollows_32='N/A'
    else:
      percentfollows_32=((follows_minus2-follows_minus3)/follows_minus3)
    if(follows_minus2==0):
      percentfollows_21='N/A'
    else:
      percentfollows_21=((follows_minus1-follows_minus2)/follows_minus2)
    data = {'Last 30 days':follows_minus1, 'Last 60 days':follows_minus2, 'Last 90 days':follows_minus3,'Last 120 days':follows_minus4}
    months = list(data.keys())
    values = list(data.values())
    fig = plt.figure(figsize = (10, 5))
    # creating the bar plot
    plt.bar(months, values,color ='maroon',width = 0.4)  
    plt.xlabel("Timeline")
    plt.ylabel("No. of followings added")
    plt.savefig(f'static/usermonthlycharts/barchart1_{i[0]}.png')
    barchart1=''
    with open(f'static/usermonthlycharts/barchart1_{i[0]}.png', "rb") as img_file:
      barchart1 = base64.b64encode(img_file.read()).decode('utf8')
    # print('********************')
    # print(barchart1)
    followerchange=[percentfollows_21,percentfollows_32,percentfollows_43]
    #print(followerchange)

    posts_minus4=len(Posts.query.with_entities(Posts.id).filter(Posts.dateposted.between(date.today()-timedelta(days=124),date.today()-timedelta(days=93)),Posts.uid==i[0]).all())
    posts_minus3=len(Posts.query.with_entities(Posts.id).filter(Posts.dateposted.between(date.today()-timedelta(days=92),date.today()-timedelta(days=61)),Posts.uid==i[0]).all())
    posts_minus2=len(Posts.query.with_entities(Posts.id).filter(Posts.dateposted.between(date.today()-timedelta(days=60),date.today()-timedelta(days=30)),Posts.uid==i[0]).all())
    posts_minus1=len(Posts.query.with_entities(Posts.id).filter(Posts.dateposted.between(date.today()-timedelta(days=29),date.today()),Posts.uid==i[0]).all())
    #print('Done')
    data = {'Last 30 days':posts_minus1, 'Last 60 days':posts_minus2, 'Last 90 days':posts_minus3,'Last 120 days':posts_minus4}
    months = list(data.keys())
    values = list(data.values())
    fig = plt.figure(figsize = (10, 5))
    # creating the bar plot
    plt.bar(months, values,color ='maroon',width = 0.4)  
    plt.xlabel("Timeline")
    plt.ylabel("No. of posts made and present")
    plt.savefig(f'static/usermonthlycharts/barchart2_{i[0]}.png')
    barchart2=''
    with open(f'static/usermonthlycharts/barchart2_{i[0]}.png', "rb") as img_file:
      barchart2 = base64.b64encode(img_file.read()).decode('utf8')
    #print(barchart2)
    #print(barchart2)
    ren=render_template('monthlyreports.html',barchart1=barchart1,barchart2=barchart2,growth=followerchange)
    pdf=pdfkit.from_string(ren,False)
    msg = Message("Your Monthly Validation!")
    msg.recipients=[i[1]]
    msg.html=render_template('monthlyemail.html',username=i[2])
    msg.attach('MonthlyReport.pdf','application/pdf',pdf)
    mail.send(msg)
    print('Send')

def getrandomhour():
  random_hour=random.randint(8,22)

  return random_hour
@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        # 10.0,
        crontab(minute=0, hour=getrandomhour()),
        dailyemails.s()
    )

    sender.add_periodic_task(
        # 10.0,
        crontab(minute=0, hour=8,day_of_month='1'),
        montlyemails.s()
    )



if __name__=='__main__':
    #print(os.environ.get('flask_email'))
    app.run(host='0.0.0.0',port=8080)