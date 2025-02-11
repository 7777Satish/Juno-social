document.addEventListener("DOMContentLoaded", function () {


    imagemenu = document.getElementById('imagemenu');
    imagefield = document.getElementById('imagefield');
    commentmenu = document.getElementById('commentmenu');
    commentfield = document.getElementById('commentfield');

    const thereadend = document.getElementById('thereadend');
    const allPosts = document.getElementById('allPosts');
    var page = 1;
    var anymoreposts = true;

    window.addEventListener('scroll', async (event)=>{
        if(anymoreposts && Math.abs(window.scrollY+innerHeight-thereadend.offsetTop)<500){
            var posts = await fetch('/api/posts?page='+page);
            posts = await posts.json();
            posts.forEach(element => {
                const html = `<article data-postid=${element.postid}>
                        <div class="top">
                            <div class="left">
                                <img alt="image" src="https://picsum.photos/30?random=${Math.floor(Math.random()*100)}"/>
                            </div>
                            <div class="right">
                                <h3><a href="#">${element.fullname}</a> <span>@${element.username}</span></h3>
                                <span>${new Date(element.date).toDateString()}</span>
                            </div>
                        </div>
                        <div class="content">
                            <p>${element.content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace('\n',"<br/>")}</p>
                            ${(element.image && element.image!='NULL')?
                                `<img alt="image" src=${element.image} />`
                            :
                                `<img alt="image" src="https://picsum.photos/500/350?random=${Math.floor(Math.random()*10)}"/>`
                            }
                        </div>
                        <div class="actions">
                            <div class="left">
                                <button class="${element.liked ? 'liked' : ''}" onclick="likepost(event)" >
                                    <span class="material-symbols-outlined">favorite</span>
                                    <span>${element.likes}</span>
                                </button>
                                <button onclick="openCommentPopup(event)">
                                    <span class="material-symbols-outlined">comment</span>
                                    <span>${element.comments}</span>
                                </button>
                            </div>
                            <div class="right">
                                <button><span class="material-symbols-outlined">bookmark</span></button>
                                <button><span class="material-symbols-outlined">reply</span></button>
                            </div>
                        </div>
                    </article><br/>`;
                allPosts.innerHTML += html;
            });
            if(posts.length<6){
                anymoreposts = false;
                thereadend.innerText = 'You have reached the end';
                return;
            }
            page++;
        }

    });
});

var imagemenu, imagefield, commentmenu, commentfield, currentCommentElement=null;

function imageMenuPopupOpen(){
    imagemenu.style.display = 'flex';
}

function imageMenuPopupClose(n){
    if(!n){
        imagefield.value = '';
    }
    imagemenu.style.display = 'none';
}

function openCommentPopup(e){
    commentmenu.style.display = 'flex';
    const postid = e.target.closest("article").getAttribute("data-postid");
    currentCommentElement = postid;
}

function closeCommentPopup(n){
    if(!n){
        commentfield.value = '';
    }
    commentmenu.style.display = 'none';
}
