function likepost(e){
    const postid = e.target.closest("article").getAttribute("data-postid");
    fetch('/api/likepost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({postid})
    }).then(res=>res.json()).then(data=>{
        const button = e.target.closest("button");
        button.classList.toggle('liked');
        button.children[1].innerText = data.likes;
    });
}

function handleCommentForm(e){
    e.preventDefault();
    const postid = currentCommentElement; 
    fetch('/api/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({postid, content:e.srcElement[0].value})
    });
    e.srcElement[0].value = '';
}

function followUser(e) {
    const username = e.target.closest('.user-item').querySelector('.data_element').getAttribute('data-username');

    fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed: username })
    })
    .then(res => res.text())
    .then(data => {
        e.target.innerText = data;
    })
    .catch(err => {
        console.error('Follow failed:', err);
    });
}
