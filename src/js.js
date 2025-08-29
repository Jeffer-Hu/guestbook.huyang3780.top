// 语言切换模块
const translatableElements = document.querySelectorAll('[data-cn], [data-en], [data-jp]');
const placeholderElements = document.querySelectorAll('[data-cn-placeholder], [data-en-placeholder], [data-jp-placeholder]');
const ogTitle = document.querySelector('meta[property="og:title"]');
const ogDesc = document.querySelector('meta[property="og:description"]');
const pageTitle = document.getElementById('page-title');

function changeLanguage(lang) {
    document.body.style.opacity = '0.5';
    document.body.style.transition = 'opacity 0.2s ease';
    
    setTimeout(() => {
        // 更新文本内容
        translatableElements.forEach(element => {
            if (element.hasAttribute(`data-${lang}`)) {
                element.innerHTML = element.getAttribute(`data-${lang}`);
            }
        });
        
        // 更新占位符
        placeholderElements.forEach(element => {
            if (element.hasAttribute(`data-${lang}-placeholder`)) {
                element.placeholder = element.getAttribute(`data-${lang}-placeholder`);
            }
        });
        
        // 更新元数据和页面标题
        if (ogTitle && ogTitle.hasAttribute(`data-${lang}`)) {
            ogTitle.setAttribute('content', ogTitle.getAttribute(`data-${lang}`));
        }
        if (ogDesc && ogDesc.hasAttribute(`data-${lang}`)) {
            ogDesc.setAttribute('content', ogDesc.getAttribute(`data-${lang}`));
        }
        if (pageTitle && pageTitle.hasAttribute(`data-${lang}`)) {
            pageTitle.textContent = pageTitle.getAttribute(`data-${lang}`);
        }
        
        // 更新HTML语言属性
        document.documentElement.lang = lang === 'cn' ? 'zh-CN' : lang === 'jp' ? 'ja' : 'en';
        
        document.body.style.opacity = '1';
    }, 200);
}

function initLanguageSelector() {
    const langSelectors = [
        document.getElementById('language-selector'),
        document.getElementById('mobile-language-selector'),
        document.getElementById('footer-language-selector')
    ].filter(selector => selector !== null);

    try {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['cn', 'en', 'jp'].includes(savedLang)) {
            langSelectors.forEach(selector => {
                selector.value = savedLang;
            });
            changeLanguage(savedLang);
        } else {
            changeLanguage('cn');
        }
    } catch (e) {
        console.error('localStorage访问错误:', e);
        changeLanguage('cn');
    }

    langSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const selectedLang = this.value;
            try {
                localStorage.setItem('preferredLanguage', selectedLang);
            } catch (e) {
                console.error('localStorage写入错误:', e);
            }
            changeLanguage(selectedLang);
        });
    });
}

// 弹窗模块
function openModal(modal) {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    
    setTimeout(() => {
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }, 300);
}

function initModals() {
    // 打开弹窗
    const modalTriggers = document.querySelectorAll('.open-modal');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) openModal(modal);
        });
    });

    // 关闭按钮
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('[id^="group-modal-"]');
            if (modal) closeModal(modal);
        });
    });

    // 点击外部关闭
    const modals = document.querySelectorAll('[id^="group-modal-"]');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('[id^="group-modal-"]').forEach(modal => {
                if (!modal.classList.contains('pointer-events-none')) {
                    closeModal(modal);
                }
            });
        }
    });
}

// 表单提交模块
function initMessageForm() {
    const form = document.getElementById('messageForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取语言设置
        const lang = localStorage.getItem('preferredLanguage') || 'cn';
        
        // 多语言消息
        const messages = {
            cn: {
                success: '留言提交成功！',
                error: '提交失败，请重试',
                emptyName: '姓名不能为空',
                emptyEmail: '邮箱不能为空',
                invalidEmail: '请输入有效的邮箱地址',
                emptyContent: '留言内容不能为空'
            },
            en: {
                success: 'Message submitted successfully!',
                error: 'Submission failed, please try again',
                emptyName: 'Name cannot be empty',
                emptyEmail: 'Email cannot be empty',
                invalidEmail: 'Please enter a valid email address',
                emptyContent: 'Message content cannot be empty'
            },
            jp: {
                success: 'メッセージが正常送信されました！',
                error: '送信に失敗しました。再試行してください',
                emptyName: '名前を入力してください',
                emptyEmail: 'メールアドレスを入力してください',
                invalidEmail: '有効なメールアドレスを入力してください',
                emptyContent: 'メッセージ内容を入力してください'
            }
        };
        
        const currentMessages = messages[lang] || messages.cn;
        
        // 获取表单值
        const name = form.querySelector('#message-name').value.trim();
        const email = form.querySelector('#message-email').value.trim();
        const content = form.querySelector('#message-content').value.trim();
        
        // 验证
        if (name === '') {
            alert(currentMessages.emptyName);
            return;
        }
        
        if (email === '') {
            alert(currentMessages.emptyEmail);
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(currentMessages.invalidEmail);
            return;
        }
        
        if (content === '') {
            alert(currentMessages.emptyContent);
            return;
        }
        
        // 提交表单
        fetch(form.action, { method: 'POST', body: new FormData(form) })
            .then(response => {
                if (response.ok) {
                    alert(currentMessages.success);
                    form.reset();
                } else {
                    alert(currentMessages.error);
                }
            })
            .catch(error => {
                alert(currentMessages.error);
            });
    });
}

// FAQ折叠模块
function initFaq() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const targetId = question.getAttribute('data-target');
            const answer = document.getElementById(targetId);
            const icon = question.querySelector('i');
            
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '1rem';
                answer.style.paddingBottom = '1rem';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// 移动端菜单模块
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', () => {
        if (mobileMenu.classList.contains('opacity-0')) {
            // 打开菜单
            mobileMenu.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
            menuToggle.innerHTML = '<i class="fa fa-times text-xl"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            // 关闭菜单
            mobileMenu.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            menuToggle.innerHTML = '<i class="fa fa-bars text-xl"></i>';
            document.body.style.overflow = '';
        }
    });
}

// 平滑滚动模块
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 关闭移动菜单
                const mobileMenu = document.getElementById('mobile-menu');
                const menuToggle = document.getElementById('menu-toggle');
                if (mobileMenu && !mobileMenu.classList.contains('opacity-0')) {
                    mobileMenu.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
                    mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fa fa-bars text-xl"></i>';
                    }
                    document.body.style.overflow = '';
                }
                
                // 滚动到目标
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 导航栏滚动效果模块
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2', 'shadow-md');
            navbar.classList.remove('py-3', 'shadow-sm');
        } else {
            navbar.classList.add('py-3', 'shadow-sm');
            navbar.classList.remove('py-2', 'shadow-md');
        }
    });
}

// 页面加载动画模块
function initPageAnimations() {
    setTimeout(() => {
        document.querySelectorAll('.section-fade').forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 100);
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 按优先级初始化
    initLanguageSelector();    // 优先初始化语言
    initMessageForm();         // 初始化表单
    initModals();              // 初始化弹窗
    initFaq();                 // 初始化FAQ
    initMobileMenu();          // 初始化移动端菜单
    initSmoothScroll();        // 初始化平滑滚动
    initNavbarScroll();        // 初始化导航栏滚动效果
    initPageAnimations();      // 初始化页面动画
});
    
