const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const errorNotFound = {error: 'id.not_found'};

let posts = [];
let nextId = 1;

function findPostIndexById(id) {
    return posts.findIndex(o => o.id === id);
}

server.get('/posts/seenPosts', (req, res) => {
    res.send(posts);
});

server.get('/posts/lastPosts/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);
    const index = postId(lastSeenId);

    let seenPosts;

    if (lastSeenId === 0) {
        if (posts.length <= 5) {
            seenPosts = posts;
        } else {
            seenPosts = posts.slice(posts.length - 5);
        }          
    } else if (lastSeenId > 0 && lastSeenId <= 5) {
        seenPosts = posts.slice(0, index);

    } else {
        seenPosts = posts.slice(index - 5, index);
    }

    res.send(seenPosts);
});


server.get('/posts/lastPostsLoad/:postId', (req, res) => {
    const postId = Number(req.params.postId)
    if (postId === posts[0].id) {
        res.send(true);
        return;
    }
    res.send(false);
})

server.post('/posts', (req, res) => { 
    const body = req.body; 
    const id = body.id; 
    if (id === 0) { 
        posts = [...posts, {id: nextId++, content: body.content, likes: 0}]; 
        res.send(posts); 
        return; 
    } 
    const index = findPostIndexById(id); 
    if (index === -1) { 
        res.status(404).send(errorNotFound); 
        return; 
    } 
 
    posts = posts.map(o => o.id !== id ? o : {...o, content: body.content}); 
    res.send(posts); 
}); 

server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);

    posts = posts.filter(o => o.id != id);

    res.send(posts);
});

server.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);

    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : {...o, likes: o.likes + 1});
    res.send(posts[index]);
});

server.delete('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);

    const index = findPostIndexById(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    }
    posts = posts.map(o => o.id !== id ? o : {...o, likes: o.likes -1});
    res.send(posts[index]);
});

server.listen(process.env.PORT || 9999);