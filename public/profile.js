document.addEventListener("DOMContentLoaded", function () {
    commentmenu = document.getElementById('commentmenu');
    commentfield = document.getElementById('commentfield');
});

var commentmenu, commentfield, currentCommentElement=null;

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
