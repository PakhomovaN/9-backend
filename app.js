const express = require('express');
const cors = require('cors');

const server = express();
server.use(express.json());
server.use(cors());

const errorNotFound = {error: 'id.not_found'};

const posts = [];
let nextId = 1;

function findPostIndexById(id) {
    return posts.findIndex(o => o.id === id);
}

server.get('/posts/:lastSeenId', (req, res) => {
    const lastSeenId = Number(req.params.lastSeenId);

    if (lastSeenId === 0) {
        res.send(posts.slice(posts.length - 5));
        return;
    }

    res.send(posts.slice(index, index + 5));
});

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
    res.status(posts);

    setTimeout(() => {
        posts.push({
            id: nextId++,
            content
        });
        res.status(204).end();
    }, 5000);
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