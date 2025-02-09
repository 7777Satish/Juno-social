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
                            <p>${element.content}</p>
                            <img alt="image" src="https://picsum.photos/500/350?random=${Math.floor(Math.random()*10)}"/>
                        </div>
                        <div class="actions">
                            <button>${element.likes} Likes</button>
                            <button>${element.likes} Comments</button>
                            <button>Follow</button>
                            <button>Tag</button>
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
