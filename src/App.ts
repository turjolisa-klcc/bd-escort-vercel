// --- CONFIG: Telegram Bot Tokens ---
const STORY_BOT_TOKEN = '8571106564:AAEPU8Scs24zR2tE36KeBZWG-UrBPCVOlt0';
const PROFILE_BOT_TOKEN = '8707175382:AAH-chJjVQN7ojCmpym3sNFewm44mfB7P4U';
const NEWS_BOT_TOKEN = '8636977291:AAHjdl4WXsxHYe6A1d8dUDnqIHVKA6Fgz_0';

// DOM Elements
const storyContainer = document.getElementById('storyContainer') as HTMLElement;
const profileGrid = document.getElementById('profileGrid') as HTMLElement;
const newsUpdateContainer = document.getElementById('newsUpdateContainer') as HTMLElement;

const menuOpen = document.getElementById('menuOpen') as HTMLElement;
const mobileMenu = document.getElementById('mobileMenu') as HTMLElement;
const menuOverlay = document.getElementById('menuOverlay') as HTMLElement;

// --- UTILITIES ---
function getFormattedDate(timestamp?: number): string {
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// --- FETCH FUNCTIONS ---
async function fetchStories() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${STORY_BOT_TOKEN}/getUpdates?limit=20`);
        const data = await res.json();
        const photos = data.result.filter((u: any) => (u.channel_post?.photo) || (u.message?.photo));

        if (photos.length > 0) {
            storyContainer.innerHTML = '';
            const seenFiles = new Set<string>();
            for (const post of photos.reverse()) {
                const msg = post.channel_post || post.message;
                const fileId = msg.photo[msg.photo.length - 1].file_id;
                if (seenFiles.has(fileId)) continue;
                seenFiles.add(fileId);

                const fileRes = await fetch(`https://api.telegram.org/bot${STORY_BOT_TOKEN}/getFile?file_id=${fileId}`);
                const fileInfo = await fileRes.json();
                if (fileInfo.ok) {
                    const imgUrl = `https://api.telegram.org/file/bot${STORY_BOT_TOKEN}/${fileInfo.result.file_path}`;
                    storyContainer.innerHTML += `
                        <div class="story-item">
                            <div class="story-ring"><img src="${imgUrl}" class="story-img"></div>
                            <div class="story-name">HISTORY</div>
                        </div>`;
                }
                if (seenFiles.size >= 10) break;
            }
        } else {
            storyContainer.innerHTML = '<div style="font-size:10px; color:#444; padding:10px;">No stories.</div>';
        }
    } catch(e) {
        console.error('Stories Fetch Error:', e);
    }
}

async function fetchProfiles() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${PROFILE_BOT_TOKEN}/getUpdates?limit=20`);
        const data = await res.json();
        const updates = data.result.filter((u: any) => (u.channel_post?.photo) || (u.message?.photo));

        if (updates.length > 0) {
            profileGrid.innerHTML = '';
            const seenFiles = new Set<string>();
            for (const update of updates.reverse()) {
                const msg = update.channel_post || update.message;
                const fileId = msg.photo[msg.photo.length - 1].file_id;
                if (seenFiles.has(fileId)) continue;
                seenFiles.add(fileId);
                const caption = msg.caption || "Elite Model, 22";
                const fileRes = await fetch(`https://api.telegram.org/bot${PROFILE_BOT_TOKEN}/getFile?file_id=${fileId}`);
                const fileInfo = await fileRes.json();
                if (fileInfo.ok) {
                    const imgUrl = `https://api.telegram.org/file/bot${PROFILE_BOT_TOKEN}/${fileInfo.result.file_path}`;
                    profileGrid.innerHTML += `
                        <div class="profile-card">
                            <img src="${imgUrl}" alt="Model">
                            <div class="profile-info">
                                <span class="profile-name">${caption}</span>
                                <div class="card-actions">
                                    <a href="#" class="btn-sm wa-bg"><i class="fa-brands fa-whatsapp"></i> Chat</a>
                                    <a href="https://t.me/bdescortapps_bot" class="btn-sm tg-bg"><i class="fa-brands fa-telegram"></i> Bot</a>
                                </div>
                            </div>
                        </div>`;
                }
            }
        }
    } catch(e) {
        console.error('Profiles Fetch Error:', e);
    }
}

async function fetchNewsUpdates() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${NEWS_BOT_TOKEN}/getUpdates?limit=15`);
        const data = await res.json();
        const updates = data.result.filter((u: any) => (u.channel_post?.photo) || (u.message?.photo));

        if (updates.length > 0) {
            newsUpdateContainer.innerHTML = '';
            const seenFiles = new Set<string>();
            for (const update of updates.reverse()) {
                const msg = update.channel_post || update.message;
                const fileId = msg.photo[msg.photo.length - 1].file_id;
                if (seenFiles.has(fileId)) continue;
                seenFiles.add(fileId);

                const fullCaption = msg.caption || "Latest News Update\nStay tuned for more updates.";
                const lines = fullCaption.split('\n');
                const title = lines[0];
                const text = lines.length > 1 ? lines.slice(1).join('\n') : "Verified update from our secure portal.";
                const dateText = getFormattedDate(msg.date);

                const fileRes = await fetch(`https://api.telegram.org/bot${NEWS_BOT_TOKEN}/getFile?file_id=${fileId}`);
                const fileInfo = await fileRes.json();
                if (fileInfo.ok) {
                    const imgUrl = `https://api.telegram.org/file/bot${NEWS_BOT_TOKEN}/${fileInfo.result.file_path}`;
                    newsUpdateContainer.innerHTML += `
                        <div class="update-item">
                            <img src="${imgUrl}" class="update-img">
                            <div class="update-info">
                                <span class="update-meta">News Box</span>
                                <div class="update-title">${title}</div>
                                <div class="update-text">${text}</div>
                                <div class="update-action-row">
                                    <a href="#" class="btn-update wa-bg"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>
                                    <a href="https://t.me/bdescortnews_bot" class="btn-update tg-bg"><i class="fa-brands fa-telegram"></i> Telegram</a>
                                    <a href="#" class="btn-update wc-bg"><i class="fa-brands fa-weixin"></i> WeChat</a>
                                </div>
                                <div class="update-footer">
                                    <span class="update-date"><i class="fa-regular fa-calendar-days"></i> ${dateText}</span>
                                </div>
                            </div>
                        </div>`;
                }
            }
        } else {
            newsUpdateContainer.innerHTML = '<div style="text-align: center; color: #444; padding: 20px; width: 100%;">No news updates posted yet.</div>';
        }
    } catch(e) {
        console.error('News Fetch Error:', e);
    }
}

// --- MENU TOGGLE ---
function toggleMenu() {
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

menuOpen.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// --- INITIALIZE ---
fetchStories();
fetchProfiles();
fetchNewsUpdates();