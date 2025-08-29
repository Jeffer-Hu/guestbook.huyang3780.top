// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.remove('bg-white/90');
        navbar.classList.add('bg-white');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('bg-white/90');
        navbar.classList.remove('bg-white');
    }
});

// 移动端菜单切换
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', function() {
    const isHidden = mobileMenu.classList.contains('opacity-0');
    
    if (isHidden) {
        mobileMenu.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
        mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        this.innerHTML = '<i class="fa fa-times text-xl"></i>';
    } else {
        mobileMenu.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        this.innerHTML = '<i class="fa fa-bars text-xl"></i>';
    }
});

// 滚动显示动画
const fadeElements = document.querySelectorAll('.section-fade');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 关闭移动菜单（如果打开）
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu.classList.contains('opacity-100')) {
                mobileMenu.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
                mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                document.getElementById('menu-toggle').innerHTML = '<i class="fa fa-bars"></i>';
            }
        }
    });
});

// 图片懒加载实现
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-image'));
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy-image');
                    lazyImage.classList.add('loaded');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // 不支持IntersectionObserver的备选方案
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
        });
    }
});

// 语言选择器功能
document.addEventListener('DOMContentLoaded', function() {
    const languageSelectors = document.querySelectorAll('#language-selector, #mobile-language-selector');
    
    languageSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // 这里可以添加语言切换逻辑
            console.log('Selected language:', selectedLanguage);
            
            // 更新所有语言选择器以保持同步
            languageSelectors.forEach(s => {
                if (s !== this) {
                    s.value = selectedLanguage;
                }
            });
        });
    });
});


// 语言切换功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有语言选择器
    const languageSelectors = [
        document.getElementById('language-selector'),
        document.getElementById('mobile-language-selector'),
        document.getElementById('footer-language-selector')
    ];
    
    // 获取所有需要翻译的元素
    const translatableElements = document.querySelectorAll('[data-cn], [data-en], [data-jp]');
    
    // 获取需要翻译placeholder的元素
    const placeholderElements = document.querySelectorAll('[data-cn-placeholder], [data-en-placeholder], [data-jp-placeholder]');
    
    // 获取meta标签
    const ogTitle = document.getElementById('og-title');
    const ogDesc = document.getElementById('og-desc');
    const pageTitle = document.getElementById('page-title');

    // 检查本地存储中是否有保存的语言偏好，默认中文
    const savedLang = localStorage.getItem('preferredLanguage') || 'cn';
    
    // 初始化语言选择器和页面语言
    languageSelectors.forEach(selector => {
        if (selector) selector.value = savedLang;
    });
    changeLanguage(savedLang);
    
    // 为所有语言选择器添加事件监听
    languageSelectors.forEach(selector => {
        if (selector) {
            selector.addEventListener('change', function() {
                const selectedLang = this.value;
                // 同步所有选择器的值
                languageSelectors.forEach(s => {
                    if (s) s.value = selectedLang;
                });
                changeLanguage(selectedLang);
                // 保存用户选择到本地存储
                localStorage.setItem('preferredLanguage', selectedLang);
            });
        }
    });
    
    // 切换语言的核心函数
    function changeLanguage(lang) {
        // 添加过渡动画
        document.body.style.opacity = '0.5';
        document.body.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            // 更新普通文本元素
            translatableElements.forEach(element => {
                if (element.hasAttribute(`data-${lang}`)) {
                    // 支持HTML内容
                    element.innerHTML = element.getAttribute(`data-${lang}`);
                }
            });
            
            // 更新placeholder属性
            placeholderElements.forEach(element => {
                if (element.hasAttribute(`data-${lang}-placeholder`)) {
                    element.placeholder = element.getAttribute(`data-${lang}-placeholder`);
                }
            });
            
            // 更新meta标签和页面标题
            if (ogTitle && ogTitle.hasAttribute(`data-${lang}`)) {
                ogTitle.setAttribute('content', ogTitle.getAttribute(`data-${lang}`));
            }
            if (ogDesc && ogDesc.hasAttribute(`data-${lang}`)) {
                ogDesc.setAttribute('content', ogDesc.getAttribute(`data-${lang}`));
            }
            if (pageTitle && pageTitle.hasAttribute(`data-${lang}`)) {
                pageTitle.textContent = pageTitle.getAttribute(`data-${lang}`);
            }
            
            // 更新页面语言属性
            document.documentElement.lang = lang === 'cn' ? 'zh-CN' : lang === 'jp' ? 'ja' : 'en';
            
            // 恢复不透明度
            document.body.style.opacity = '1';
        }, 200);
    }

// 导航栏滚动效果
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
	if (!navbar) return;
	
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	
	if (scrollTop > 50) {
		navbar.classList.add('py-2', 'shadow');
		navbar.classList.remove('py-3');
	} else {
		navbar.classList.add('py-3');
		navbar.classList.remove('py-2', 'shadow');
	}
	
	lastScrollTop = scrollTop;
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function(e) {
		e.preventDefault();
		
		const targetId = this.getAttribute('href');
		if (targetId === '#') return;
		
		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			// 关闭移动菜单（如果打开）
			if (mobileMenu && !mobileMenu.classList.contains('pointer-events-none')) {
				mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
				mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
				if (menuToggle) menuToggle.innerHTML = '<i class="fa fa-bars"></i>';
			}
			
			// 平滑滚动到目标位置
			window.scrollTo({
				top: targetElement.offsetTop - 80,
				behavior: 'smooth'
			});
		}
	});
});
});

// 等待页面DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言选择器（适配两个页面的所有选择器ID）
    const initLanguageSelector = () => {
        // 获取所有语言选择器（两个页面中可能存在的ID）
        const langSelectors = [
            document.getElementById('language-selector'),
            document.getElementById('mobile-language-selector'),
            document.getElementById('footer-language-selector')
        ].filter(selector => selector !== null); // 过滤不存在的选择器

        // 从本地存储读取保存的语言偏好
        const savedLang = localStorage.getItem('preferredLanguage');
        
        // 如果有保存的语言，同步到所有选择器并应用
        if (savedLang) {
            langSelectors.forEach(selector => {
                selector.value = savedLang;
            });
            changeLanguage(savedLang); // 应用语言
        }

        // 为所有选择器添加切换事件
        langSelectors.forEach(selector => {
            selector.addEventListener('change', function() {
                const selectedLang = this.value;
                localStorage.setItem('preferredLanguage', selectedLang); // 保存到本地存储
                changeLanguage(selectedLang); // 应用语言
            });
        });
    };

    // 语言切换核心函数（更新页面所有多语言元素）
    const changeLanguage = (lang) => {
        // 更新所有带多语言属性的元素（data-cn/data-en/data-jp）
        document.querySelectorAll('[data-cn], [data-en], [data-jp]').forEach(el => {
            const langAttr = `data-${lang}`;
            if (el.hasAttribute(langAttr)) {
                el.innerHTML = el.getAttribute(langAttr); // 支持HTML内容（如图标）
            }
        });

        // 更新页面标题（如果有设置多语言属性）
        const titleEl = document.getElementById('page-title');
        if (titleEl && titleEl.hasAttribute(`data-${lang}`)) {
            document.title = titleEl.getAttribute(`data-${lang}`);
        }
    };

    // 初始化语言选择器（页面加载时执行）
    initLanguageSelector();
});

// 留言分类筛选
document.addEventListener('DOMContentLoaded', function() {
	const categoryButtons = document.querySelectorAll('.message-category');
	const messageItems = document.querySelectorAll('.message-item');
	
	categoryButtons.forEach(button => {
		button.addEventListener('click', function() {
			// 更新按钮样式
			categoryButtons.forEach(btn => {
				btn.classList.remove('bg-primary', 'text-white');
				btn.classList.add('bg-softGray', 'hover:bg-primary', 'hover:text-white');
			});
			this.classList.remove('bg-softGray', 'hover:bg-primary', 'hover:text-white');
			this.classList.add('bg-primary', 'text-white');
			
			// 筛选留言
			const category = this.getAttribute('data-category');
			messageItems.forEach(item => {
				if (category === 'all' || item.getAttribute('data-category') === category) {
					item.style.display = 'block';
				} else {
					item.style.display = 'none';
				}
			});
		});
	});
	
	// 常见问题折叠功能
	const faqQuestions = document.querySelectorAll('.faq-question');
	faqQuestions.forEach(question => {
		question.addEventListener('click', function() {
			const targetId = this.getAttribute('data-target');
			const target = document.getElementById(targetId);
			const icon = this.querySelector('i');
			
			// 切换展开/收起
			if (target.style.maxHeight) {
				target.style.maxHeight = null;
				icon.style.transform = 'rotate(0deg)';
			} else {
				target.style.maxHeight = target.scrollHeight + 'px';
				icon.style.transform = 'rotate(180deg)';
			}
		});
	});
	
	// 交流群二维码模态框
	const groupButtons = document.querySelectorAll('[data-toggle="group-qr"]');
	const modal = document.getElementById('group-qr-modal');
	const closeModal = document.getElementById('close-modal');
	const modalTitle = document.getElementById('modal-title');
	const modalDesc = document.getElementById('modal-desc');
	const qrcodeImage = document.getElementById('qrcode-image');
	
	groupButtons.forEach(button => {
		button.addEventListener('click', function() {
			const group = this.getAttribute('data-group');
			
			// 根据群组类型设置模态框内容
			if (group === 'tech') {
				modalTitle.textContent = modalTitle.getAttribute('data-cn');
				modalDesc.textContent = modalDesc.getAttribute('data-cn');
				qrcodeImage.innerHTML = '<img src="pic/tech-qr.jpg" alt="技术交流群二维码" class="w-full h-full object-contain">';
			} else {
				modalTitle.textContent = modalTitle.getAttribute('data-cn');
				modalDesc.textContent = modalDesc.getAttribute('data-cn');
				qrcodeImage.innerHTML = '<img src="pic/study-qr.jpg" alt="留学交流群二维码" class="w-full h-full object-contain">';
			}
			
			// 显示模态框
			modal.classList.remove('hidden');
			document.body.style.overflow = 'hidden';
		});
	});
	
	closeModal.addEventListener('click', function() {
		modal.classList.add('hidden');
		document.body.style.overflow = '';
	});
	
	// 点击模态框外部关闭
	modal.addEventListener('click', function(e) {
		if (e.target === modal) {
			modal.classList.add('hidden');
			document.body.style.overflow = '';
		}
	});
	
	// 留言表单提交
	const messageForm = document.getElementById('message-form');
	if (messageForm) {
		messageForm.addEventListener('submit', function(e) {
			e.preventDefault();
			// 这里可以添加表单提交逻辑
			alert(
				messageForm.getAttribute('data-cn') || 
				messageForm.getAttribute('data-en') || 
				messageForm.getAttribute('data-jp')
			);
			messageForm.reset();
		});
	}
});

document.getElementById('messageForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = this;
  
  // 获取本地存储的语言偏好，默认使用中文
  const lang = localStorage.getItem('preferredLanguage') || 'cn';
  
  // 定义多语言提示信息
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
  
  // 获取当前语言对应的提示信息，默认使用中文
  const currentMessages = messages[lang] || messages.cn;
  
  // 获取表单字段值
  const name = form.querySelector('#message-name').value.trim();
  const email = form.querySelector('#message-email').value.trim();
  const content = form.querySelector('#message-content').value.trim();
  
  // 验证逻辑
  if (name === '') {
    alert(currentMessages.emptyName);
    return; // 阻止提交
  }
  
  if (email === '') {
    alert(currentMessages.emptyEmail);
    return;
  }
  
  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert(currentMessages.invalidEmail);
    return;
  }
  
  if (content === '') {
    alert(currentMessages.emptyContent);
    return;
  }
  
  // 验证通过，提交表单
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

// 弹窗控制逻辑 - 支持多个弹窗
document.addEventListener('DOMContentLoaded', function() {
  // 打开弹窗按钮
  document.querySelectorAll('.open-modal').forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const modal = document.getElementById(targetId);
      
      if (modal) {
        // 显示弹窗并添加动画
        modal.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          modal.querySelector('div').classList.remove('scale-95');
          modal.querySelector('div').classList.add('scale-100');
        }, 10);
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // 关闭弹窗功能
  function closeModal(modal) {
    // 隐藏弹窗并添加动画
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    
    setTimeout(() => {
      modal.classList.add('opacity-0', 'pointer-events-none');
      // 恢复背景滚动
      document.body.style.overflow = '';
    }, 300);
  }
  
  // 关闭按钮
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('[id^="group-modal-"]');
      if (modal) closeModal(modal);
    });
  });
  
  // 点击弹窗外部关闭
  document.querySelectorAll('[id^="group-modal-"]').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // 按ESC键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('[id^="group-modal-"]').forEach(modal => {
        if (!modal.classList.contains('pointer-events-none')) {
          closeModal(modal);
        }
      });
    }
  });
});

