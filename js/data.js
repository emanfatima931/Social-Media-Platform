// ===== SOCIAL NETWORK DATABASE =====
class Database {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Initialize sample data if database is empty
        if (!localStorage.getItem('usersDB')) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        const users = [
            {
                id: '1001',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: 'password123',
                bio: 'Photography & Travel 📸',
                profilePic: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=1abc9c&color=fff&size=200',
                friends: ['1002', '1003'],
                createdAt: new Date().toISOString(),
                isOnline: true
            },
            {
                id: '1002',
                name: 'Bob Smith',
                email: 'bob@example.com',
                password: 'password123',
                bio: 'Developer & Tech Enthusiast 💻',
                profilePic: 'https://ui-avatars.com/api/?name=Bob+Smith&background=ff6b6b&color=fff&size=200',
                friends: ['1001', '1003'],
                createdAt: new Date().toISOString(),
                isOnline: true
            },
            {
                id: '1003',
                name: 'Carol White',
                email: 'carol@example.com',
                password: 'password123',
                bio: 'Designer & Artist 🎨',
                profilePic: 'https://ui-avatars.com/api/?name=Carol+White&background=f39c12&color=fff&size=200',
                friends: ['1001', '1002'],
                createdAt: new Date().toISOString(),
                isOnline: false
            }
        ];

        const posts = [
            {
                id: '2001',
                userId: '1001',
                content: 'Just finished an amazing hiking trip! The views were incredible 🏔️',
                likes: ['1002', '1003'],
                comments: [
                    { userId: '1002', text: 'Amazing! Where was this?' }
                ],
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '2002',
                userId: '1002',
                content: 'Just launched my new project! Excited to share it with you all 🎉',
                likes: ['1001', '1003'],
                comments: [],
                createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: '2003',
                userId: '1003',
                content: 'Working on some new design concepts 🎨 What do you think?',
                likes: ['1001'],
                comments: [
                    { userId: '1001', text: 'Looks amazing!' }
                ],
                createdAt: new Date(Date.now() - 10800000).toISOString()
            }
        ];

        localStorage.setItem('usersDB', JSON.stringify(users));
        localStorage.setItem('postsDB', JSON.stringify(posts));
        localStorage.setItem('friendRequestsDB', JSON.stringify([]));
        localStorage.setItem('notificationsDB', JSON.stringify([]));
    }

    // ===== USER METHODS =====
    getUsers() {
        return JSON.parse(localStorage.getItem('usersDB')) || [];
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    createUser(name, email, password, bio = '') {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            bio: bio,
            profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1abc9c&color=fff&size=200`,
            friends: [],
            createdAt: new Date().toISOString(),
            isOnline: false
        };
        users.push(newUser);
        localStorage.setItem('usersDB', JSON.stringify(users));
        return newUser;
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        const user = users.find(u => u.id === userId);
        if (user) {
            Object.assign(user, updates);
            localStorage.setItem('usersDB', JSON.stringify(users));
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            return true;
        }
        return false;
    }

    // ===== POST METHODS =====
    getPosts() {
        const posts = JSON.parse(localStorage.getItem('postsDB')) || [];
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    createPost(userId, content, image = null) {
        const posts = this.getPosts();
        const newPost = {
            id: Date.now().toString(),
            userId: userId,
            content: content,
            image: image,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString()
        };
        posts.unshift(newPost);
        localStorage.setItem('postsDB', JSON.stringify(posts));
        return newPost;
    }

    likePost(postId, userId) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            const index = post.likes.indexOf(userId);
            if (index === -1) {
                post.likes.push(userId);
            } else {
                post.likes.splice(index, 1);
            }
            localStorage.setItem('postsDB', JSON.stringify(posts));
            return true;
        }
        return false;
    }

    addComment(postId, userId, text) {
        const posts = this.getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({ userId, text });
            localStorage.setItem('postsDB', JSON.stringify(posts));
            return true;
        }
        return false;
    }

    // ===== FRIEND METHODS =====
    sendFriendRequest(fromId, toId) {
        const requests = JSON.parse(localStorage.getItem('friendRequestsDB')) || [];
        const exists = requests.find(r => 
            (r.from === fromId && r.to === toId) ||
            (r.from === toId && r.to === fromId)
        );
        
        if (!exists) {
            requests.push({
                id: Date.now().toString(),
                from: fromId,
                to: toId,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('friendRequestsDB', JSON.stringify(requests));
            return true;
        }
        return false;
    }

    getFriendRequests(userId) {
        const requests = JSON.parse(localStorage.getItem('friendRequestsDB')) || [];
        return requests.filter(r => r.to === userId && r.status === 'pending');
    }

    acceptFriendRequest(requestId) {
        const requests = JSON.parse(localStorage.getItem('friendRequestsDB')) || [];
        const request = requests.find(r => r.id === requestId);
        
        if (request && request.status === 'pending') {
            const users = this.getUsers();
            const user1 = users.find(u => u.id === request.from);
            const user2 = users.find(u => u.id === request.to);
            
            if (user1 && user2) {
                if (!user1.friends) user1.friends = [];
                if (!user2.friends) user2.friends = [];
                
                if (!user1.friends.includes(user2.id)) user1.friends.push(user2.id);
                if (!user2.friends.includes(user1.id)) user2.friends.push(user1.id);
                
                request.status = 'accepted';
                localStorage.setItem('usersDB', JSON.stringify(users));
                localStorage.setItem('friendRequestsDB', JSON.stringify(requests));
                return true;
            }
        }
        return false;
    }

    getFriends(userId) {
        const user = this.getUserById(userId);
        if (!user || !user.friends) return [];
        return user.friends.map(id => this.getUserById(id)).filter(u => u);
    }

    // ===== LOGIN/LOGOUT =====
    login(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password) {
            user.isOnline = true;
            this.updateUser(user.id, user);
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    logout() {
        if (this.currentUser) {
            this.updateUser(this.currentUser.id, { isOnline: false });
        }
        this.currentUser = null;
        localStorage.setItem('currentUser', JSON.stringify(null));
    }

    register(name, email, password, bio = '') {
        const exists = this.getUserByEmail(email);
        if (exists) {
            return { success: false, message: 'Email already registered' };
        }
        
        const newUser = this.createUser(name, email, password, bio);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        return { success: true, user: newUser };
    }
}

// Initialize Database
const db = new Database();
