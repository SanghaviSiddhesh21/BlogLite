const dashboard=Vue.component('dashboard',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <div id='outerfeedbox'>
            <div id='innerfeedbox'>
                <template v-for='i in feed'>
                    <b-container fluid>
                        <b-row class="text-center">
                            <b-col class='profile-posts-columnsection'>
                                <div class='profile-posts-titlesection'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.followerid}}">{{i.followerusername}}</router-link></div>
                                <img style='display:block; width:300px;height:300px;margin-top:25px;margin-left:25px;' v-bind:src="'data:image/png;base64,'+i.postpic" alt="Red dot" /><br>
                                <div class='profile-posts-titlesection'>{{i.posttitle}}</div>
                                <div class='profile-posts-descriptionsection'>{{i.postcaption}}</div>
                            </b-col>
                        </b-row>
                    </b-container>
                <template>
            </div>
        </div>
        <h1 style='text-align: center;'>You are all caught up</h1>
    </div>
    `,
    data:function(){
        return{
            feed:[]
        }
    },
    mounted:function(){
        userid=document.getElementById('userid').value;
        url='http://127.0.0.1:8080/api/newfeed/'+userid;
        fetch(url,{
            method:'GET',
            header:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json())
        .then(data=>this.feed=data)
        console.log(this.feed)
    }
})
const addpost=Vue.component('addpost',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-nav-item></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <div id='addingpost-main-body'>
            <h2>Share with everyone!</h2><br>
            <label for='posttitle'>Title:</label>
            <input v-model="posttitle" placeholder="Enter your post's title" id='posttitle'><br><br>
            <label for='postcaption'>Caption:</label><br>
            <textarea v-model="postcaption" id='postcaption' rows="3" cols="40"></textarea><br><br>
            <input v-on:change='tobaseconversion' type='file' accept='image/png ,image/jpg' id='addpost-fileinput'><br><br>
            <button v-on:click='create_new_post'>Post it!</button>
        </div>
    </div>
    `,
    data:function(){
        return{
            base64_:'Not in base64 yet'
        }
    },
    methods:{
        create_new_post:function(){
            posttitle=document.getElementById('posttitle').value;
            postcaption=document.getElementById('postcaption').value;
            postpic=base64_;
            userid=document.getElementById('userid').value;
            data={
                "userid":userid,
                "posttitle":posttitle,
                "postcaption":postcaption,
                "postpic":postpic
            }
            fetch("http://127.0.0.1:8080/api/createpost",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(data),
            }).then(
                data=>{
                    console.log(data)
                    router.push({path:'/myprofile'})
                }
            ).catch((error)=>{
                console.log('Error:',error);
            })

        },
        tobaseconversion:function(){
            //alert('Hey');
            var file = document.querySelector('#addpost-fileinput')['files'][0];
            //alert(file); //Output=> [object HTMLInputElement]
            var reader = new FileReader();
            //console.log("next");
            reader.onload = function () {
                base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
                // imageBase64Stringsep = base64String;
                // alert(imageBase64Stringsep);
                base64_=base64String;
                //alert(base64_)
            }
            reader.readAsDataURL(file);
        }
    }
})

const myprofile=Vue.component('myprofile',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-nav-item></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                        <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                        <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                        <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                        <button type='submit' class='button-custom'><a href='/Export'>Export</a></button>
                        <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                        <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <div id='profile-userinfo'>
            <b-container fluid>
                <b-row class="text-center">
                    <b-col cols='5' class='profile-userinfo-columnsection'>
                        <h3>{{mydata.username}}</h3>
                        <img style='display:block; width:250px;height:250px;margin-top:25px;margin-left:170px;border-radius:50%;' v-bind:src="'data:image/png;base64,'+mydata.profilepic" alt="Red dot" />
                    </b-col>
                    <b-col cols='6' class='profile-userinfo-columnsection'>
                        <b-container fluid>
                            <b-row class='text-centre'>
                                <b-col class='profile-userinfo-innercolumnsection'>Total Posts</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'><router-link to="/following" class='navbar-sidebar-options'>Following</router-link></b-col>
                                <b-col class='profile-userinfo-innercolumnsection'><router-link to="/followedby" class='navbar-sidebar-options'>Followed by</router-link></b-col>
                            </b-row>
                            <b-row class='text-centre'>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.totalposts}}</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.following}}</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.follower}}</b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div>
            <b-container fluid>
                <b-row class="text-center">
                    <b-col v-for='i in mydata.posts' class='profile-posts-columnsection'>
                        <img style='display:block; width:300px;height:300px;margin-top:25px;margin-left:25px;' v-bind:src="'data:image/png;base64,'+i.postpic" alt="Red dot" /><br>
                        <div class='profile-posts-titlesection'>{{i.posttitle}}</div>
                        <div class='profile-posts-descriptionsection'>{{i.postcaption}}</div>
                        <div>
                        <button><router-link :to="{path:'/editpost',query:{postid : i.postid}}">Edit Post</router-link></button>
                        <button><router-link :to="{path:'/deletepost',query:{postid : i.postid}}">Delete Post</router-link></button>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
    `,
    data:function(){
        return{
            mydata:{}
        }
    },
    methods:{
        editpost(id){
            console.log(this.selected)
        }
    },
    mounted:function(){
        userid=document.getElementById('userid').value;
        url='http://127.0.0.1:8080/api/userprofile/'+userid;
        fetch(url,{
            method:'GET',
            header:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json())
        .then(data=>this.mydata=data)
        console.log(this.posts)
    }
})

const following=Vue.component('following',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/following" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template><br><br>
        <b-container class="bv-example-row">
            <b-row class='following-rowsection-first'>
                <b-col>People you follow</b-col>
            </b-row><br><br>
            <template v-for='i in followinglist'> 
                <b-row class='following-rowsection text-center'>
                    <b-col sm='8'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.followingid}}">{{i.username}}</router-link></b-col>
                    <b-col sm='4'><button><router-link :to="{path:'/unfollowuser',query:{followingid : i.followingid}}">Unfollow User</router-link></button></b-col>
                </b-row>
            </template>
        </b-container>
    </div>
    `,
    data:function(){
        return{
            followinglist:[]
        }
    },
    mounted:function(){
        userid=document.getElementById('userid').value;
        url='http://127.0.0.1:8080/api/usersfollowing/'+userid;
        //console.log(url);
        fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        }).then(res=>res.json())
        .then(data=> this.followinglist=data)
    }
})

const followedby=Vue.component('followedby',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/followedby" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template><br><br>
        <b-container class="bv-example-row">
            <b-row class='following-rowsection-first'>
                <b-col>People who follows you</b-col>
            </b-row><br><br>
            <template v-if='followinglist.canfollow != []'>
                <b-row class='following-rowsection text-center' v-for='i in followinglist.canfollow'>
                    <b-col sm='8'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.userid}}">{{i.username}}</router-link></b-col>
                    <b-col sm='4'><button><router-link :to="{path:'/followuser',query:{followerid : i.userid}}">Follow User</router-link></button></b-col>
                </b-row>
            </template>
            <template v-if='followinglist.canunfollow != []'>
                <b-row class='following-rowsection text-center' v-for='i in followinglist.canunfollow'>
                    <b-col sm='8'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.userid}}">{{i.username}}</router-link></b-col>
                    <b-col sm='4'><button><router-link :to="{path:'/unfollowuser',query:{followingid : i.userid}}">Unfollow User</router-link></button></b-col>
                </b-row>
            </template>
        </b-container>
    </div>
    `,
    data:function(){
        return{
            followinglist:{}
        }
    },
    mounted:function(){
        userid=document.getElementById('userid').value;
        url='http://127.0.0.1:8080/api/usersfollowers/'+userid;
        fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        }).then(res=>res.json())
        .then(data=> this.followinglist=data)
    }
})


const searchtab=Vue.component('searchtab',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/followedby" class='navbar-sidebar-options'>Close</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template><br><br>
        <b-container class="bv-example-row">
            <b-row class='following-rowsection-first text-centre'>
                <input type="text" @input="inputChange" />
            </b-row><br><br>
            <template v-if='searcheduser.tounfollow != []'>
                <b-row class='following-rowsection text-center' v-for="i in searcheduser.tounfollow">
                    <b-col sm='8'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.userid}}">{{i.username}}</router-link></b-col>
                    <b-col sm='4'><button><router-link :to="{path:'/unfollowuser',query:{followingid : i.userid}}">Unfollow User</router-link></button></b-col>
                </b-row>
            <template>
            <template v-if='searcheduser.tofollow != []'>
                <b-row class='following-rowsection text-center' v-for="i in searcheduser.tofollow">
                    <b-col sm='8'><router-link :to="{path:'/otheruserprofile',query:{otheruserid : i.userid}}">{{i.username}}</router-link></b-col>
                    <b-col sm='4'><b-col sm='4'><button><router-link :to="{path:'/followuser',query:{followerid : i.userid}}">Follow User</router-link></button></b-col></b-col>
                </b-row>
            <template>
        </b-container>
    </div>
    `,
    data:function(){
        return{
            searcheduser:[]
        }
    },
    methods:{
        inputChange(e) {
            userid=document.getElementById('userid').value;
            searchtext=e.target.value;
            data={
                'userid':userid,
                'regexstring':searchtext
            }
            fetch("http://127.0.0.1:8080/api/searched",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(data),
            }).then(res=>res.json()).then(
                data=>{
                    this.searcheduser=data
                    //console.log(data)
                    //console.log(this.searcheduser)
                }
            ).catch((error)=>{
                console.log('Error:',error);
            })
        }
    }
})

const editpost=Vue.component('editpost',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-nav-item></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <template v-for='i in predata'>
            <div id='editpost-main-body' >
                <h2>Share with everyone!</h2><br>
                <img id='editpreimage' style='display:block; width:200px;height:200px;margin-top:25px;margin-left:43%;' v-bind:src="'data:image/png;base64,'+i.postpic" alt="Red dot" /><br>
                <label for='posttitle'>Title:</label>
                <input id='posttitle' v-model=i.posttitle><br><br>
                <label for='postcaption'>Caption:</label><br>
                <textarea id='postcaption' rows="3" cols="40" v-model=i.postcaption></textarea><br><br>
                <input v-on:change='tobaseconversion' type='file' accept='image/png ,image/jpg' id='editpost-fileinput'><br><br>
                <button v-on:click='editpost'>Post it!</button>
            </div>
        </template>
    </div>
    `,
    data:function(){
        return{
            base64_:'Not in base 64',
            postid:this.$route.query.postid,
            predata:[]
        }
    },
    methods:{
        editpost:function(){
            //alert(base64_)
            userid=document.getElementById('userid').value;
            //alert(userid)
            posttitle=document.getElementById('posttitle').value;
            //alert(posttitle)
            postcaption=document.getElementById('postcaption').value;
            //alert(postcaption)
            postpic=base64_;
            //alert(postpic)
            if(this.predata[0]['postpic']!=base64_){
                data={
                    "userid":userid,
                    "postid":this.$route.query.postid,
                    "posttitle":posttitle,
                    "postcaption":postcaption,
                    "postpic":postpic
                }
                console.log(data)
                fetch("http://127.0.0.1:8080/api/editpostwithimage",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(data),
                }).then(
                    data=>{
                        //console.log(data)
                        router.push({path:'/myprofile'})
                    }
                ).catch((error)=>{
                    console.log('Error:',error);
                })
            }else{
                data={
                    "userid":userid,
                    "postid":this.$route.query.postid,
                    "posttitle":posttitle,
                    "postcaption":postcaption,
                }
                fetch("http://127.0.0.1:8080/api/editpostwithoutimage",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(data),
                }).then(
                    data=>{
                        //console.log(data)
                        router.push({path:'/myprofile'})
                    }
                ).catch((error)=>{
                    console.log('Error:',error);
                })
            }
        },
        tobaseconversion:function(){
            //alert('Hey');
            var file = document.querySelector('#editpost-fileinput')['files'][0];
            //alert(file); //Output=> [object HTMLInputElement]
            var reader = new FileReader();
            console.log("next");
            reader.onload = function () {
                base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
                //imageBase64Stringsep = base64String;
                //alert(imageBase64Stringsep);
                base64_=base64String;
                //alert(base64_)
            }
            reader.readAsDataURL(file);
            
        }
    },
    mounted:function(){
        url='http://127.0.0.1:8080/api/preeditpost/'+this.$route.query.postid;
        console.log(url);
        fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        }).then(res=>res.json())
        .then(data=> this.predata=data)
    }
})

const deletepost=Vue.component('deletepost',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Title</router-link></b-nav-item></b-navbar-brand>
        </div>
        </b-navbar>
        <h1>Deleting Post</h1>
    </div>
    `,
    mounted:function(){
        userid=document.getElementById('userid').value;
        postid=this.$route.query.postid
        data={
            "userid":userid,
            "postid":this.$route.query.postid
        }
        //console.log(data)
        fetch("http://127.0.0.1:8080/api/editpostwithoutimage",{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data),
        }).then(
            data=>{
                console.log(data)
            }
        ).catch((error)=>{
            console.log('Error:',error);
        })
        router.push({path:'/myprofile'})
    }
})
const followuser=Vue.component('followuser',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Title</router-link></b-nav-item></b-navbar-brand>
        </div>
        </b-navbar>
        <h1>Following User</h1>
    </div>
    `,
    mounted:function(){
        userid=document.getElementById('userid').value;
        followerid=this.$route.query.followerid;
        data={
            "userid":userid,
            "followerid":this.$route.query.followerid
        }
        //console.log(data)
        fetch("http://127.0.0.1:8080/api/followuser",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data),
        }).then(
            data=>{
                console.log(data)
            }
        ).catch((error)=>{
            console.log('Error:',error);
        })
        router.push({path:'/following'})
    }
})
const unfollowuser=Vue.component('unfollowuser',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Title</router-link></b-nav-item></b-navbar-brand>
        </div>
        </b-navbar>
        <h1>Unfollowing User</h1>
    </div>
    `,
    mounted:function(){
        userid=document.getElementById('userid').value;
        followingid=this.$route.query.followingid;
        data={
            "userid":userid,
            "followingid":this.$route.query.followingid
        }
        //console.log(data)
        fetch("http://127.0.0.1:8080/api/followuser",{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(data),
        }).then(
            data=>{
                console.log(data)
            }
        ).catch((error)=>{
            console.log('Error:',error);
        })
        router.push({path:'/followedby'})
    }
})
const otheruserprofile=Vue.component('otheruserprofile',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-nav-item></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                        <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                        <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                        <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                        <b-nav-item href='#' @click="hide"><router-link to="/personaldetails" class='navbar-sidebar-options'>personaldetails</router-link></b-nav-item>
                        <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <div id='profile-userinfo'>
            <b-container fluid>
                <b-row class="text-center">
                    <b-col cols='5' class='profile-userinfo-columnsection'>
                        <h3>{{mydata.username}}</h3>
                        <img style='display:block; width:250px;height:250px;margin-top:25px;margin-left:170px;border-radius:50%;' v-bind:src="'data:image/png;base64,'+mydata.profilepic" alt="Red dot" />
                    </b-col>
                    <b-col cols='6' class='profile-userinfo-columnsection'>
                        <b-container fluid>
                            <b-row class='text-centre'>
                                <b-col class='profile-userinfo-innercolumnsection'>Total Posts</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>Following</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>Followed by</b-col>
                            </b-row>
                            <b-row class='text-centre'>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.totalposts}}</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.following}}</b-col>
                                <b-col class='profile-userinfo-innercolumnsection'>{{mydata.follower}}</b-col>
                            </b-row>
                        </b-container>
                    </b-col>
                </b-row>
            </b-container>
        </div>
        <div>
            <b-container fluid>
                <b-row class="text-center">
                    <b-col v-for='i in mydata.posts' class='profile-posts-columnsection'>
                        <img style='display:block; width:300px;height:300px;margin-top:25px;margin-left:25px;' v-bind:src="'data:image/png;base64,'+i.postpic" alt="Red dot" /><br>
                        <div class='profile-posts-titlesection'>{{i.posttitle}}</div>
                        <div class='profile-posts-descriptionsection'>{{i.postcaption}}</div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
    `,
    data:function(){
        return{
            mydata:{}
        }
    },
    methods:{
        editpost(id){
            console.log(this.selected)
        }
    },
    mounted:function(){
        url='http://127.0.0.1:8080/api/otheruserprofile/'+this.$route.query.otheruserid;
        fetch(url,{
            method:'GET',
            header:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json())
        .then(data=>this.mydata=data)
        console.log(this.posts)
    }
})

const personaldetails=Vue.component('personaldetails',{
    template:`
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
        <div id='navbar-title'>
            <b-navbar-brand href="#"><router-link to="/" class='navbar-title-router'>Blogup!</router-link></b-nav-item></b-navbar-brand>
        </div>
        <div id='navbar-sidebar'>
            <b-button v-b-toggle.sidebar-no-header>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
            </b-button>
        </div>
        </b-navbar>
        <template>
            <div>
                <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                    <div class="p-3">
                    <nav class="mb-3">
                        <b-nav horizontal>
                            <b-nav-item href='#' @click="hide"><router-link to="/myprofile" class='navbar-sidebar-options'>Profile</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/searchtab" class='navbar-sidebar-options'>Search Bar</router-link></b-nav-item>
                            <b-nav-item href='#' @click="hide"><router-link to="/addpost" class='navbar-sidebar-options'>Create Post</router-link></b-nav-item>
                            <button type='submit' class='button-custom'><a href='/Logout'>Logout</a></button>
                        </b-nav>
                    </nav>
                </template>
                </b-sidebar>
            </div>
        </template>
        <b-container class="bv-example-row" id='outercontainer_personaldetails'>
            <b-row>
                <b-col cols='5'><img style='display:block; width:250px;height:250px;margin-top:25px;margin-left:170px;border-radius:50%;' v-bind:src="'data:image/png;base64,'+mydata.profilepic" alt="Red dot" /></b-col>
                <b-col cols='7'>
                    <div id='innercontainer_personaldetails'>
                        <b-row>First Name:<br><input type='text' v-model=mydata.firstname id='fname'></b-row><br>
                        <b-row>Last Name:<input type='text' v-model=mydata.lastname id='lname'></b-row><br>
                        <b-row>Username:<input type='text' v-model=mydata.username id='username'></b-row><br>
                        <b-row>Date of Birth:<input type='text' v-model=mydata.dateofbirth disabled></b-row><br>
                        <b-row>New Profilepic:<input v-on:change='tobaseconversion' type='file' accept='image/png ,image/jpg' id='newprofile-fileinput'></b-row><br>
                        <b-row><button v-on:click='editdetails'>Save Changes</button</b-row><br>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
    `,
    data:function(){
        return{
            mydata:{},
            base64_:'Not in base 64'
        }
    },
    methods:{
        editdetails:function(){
            fname=document.getElementById('fname').value;
            lname=document.getElementById('lname').value;
            username=document.getElementById('username').value;
            newpic=base64_;
            data={
                'fname':fname,
                'lname':lname,
                'username':username,
                'profilepic':newpic
            }
            url='http://127.0.0.1:8080/api/personaldetails/'+document.getElementById('userid').value;
            fetch(url,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(data),
                }).then(
                    data=>{
                        //console.log(data)
                        router.push({path:'/personaldetails'})
                    }
                ).catch((error)=>{
                    console.log('Error:',error);
                })
        },
        tobaseconversion:function(){
            //alert('Hey');
            var file = document.querySelector('#newprofile-fileinput')['files'][0];
            //alert(file); //Output=> [object HTMLInputElement]
            var reader = new FileReader();
            console.log("next");
            reader.onload = function () {
                base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
                imageBase64Stringsep = base64String;
                //alert(imageBase64Stringsep);
                //alert(base64String)
                base64_=base64String;
                //alert(base64_)
            }
            reader.readAsDataURL(file);
        }
    },
    mounted:function(){
        url='http://127.0.0.1:8080/api/personaldetails/'+document.getElementById('userid').value;
        fetch(url,{
            method:'GET',
            header:{
                'Content-Type':'application/json',
            }
        }).then(res=>res.json())
        .then(data=>this.mydata=data)
        //console.log(this.posts)
    }
    
})

const routes=[{
    path:'/',
    component:dashboard
},{
    path:'/addpost',
    component:addpost
},{
    path:'/myprofile',
    component:myprofile
},{
    path:'/following',
    component:following
},{
    path:'/followedby',
    component:followedby
},{
    path:'/searchtab',
    component:searchtab
},{
    path:'/editpost',
    component:editpost,
    props(route) {
        return {  postid: route.query.postid }
    }
},{
    path:'/deletepost',
    component:deletepost,
    props(route){
        return {postid : route.query.postid}
    }
},{
    path:'/followuser',
    component:followuser,
    props(route){
        return {followerid : route.query.followerid}
    }
},{
    path:'/unfollowuser',
    component:unfollowuser,
    props(route){
        return {followingid : route.query.followingid}
    }
},{
    path:'/myprofilefollowuser',
    component:followuser,
    props(route){
        return {followerid : route.query.followerid}
    }
},{
    path:'/myunfollowuser',
    component:unfollowuser,
    props(route){
        return {followingid : route.query.followingid}
    }
},{
    path:'/otheruserprofile',
    component:otheruserprofile,
    props(route){
        return {otheruserid : route.query.otheruserid}
    }
},{
    path:'/personaldetails',
    component:personaldetails
}]

const router=new VueRouter({
    routes
})

var app= new Vue({
    el:"#app",//takes the id 
    router:router
})