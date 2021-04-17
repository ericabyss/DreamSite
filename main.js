'use strict'

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    if (window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', event => {
    console.log(event.target.dataset.link);
    const target = event.target;
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove('open');
    scrollIntoView(link); //link 받아오기
    selectNavItem(target); //target 받아오기
}); 

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', (event) => {
    scrollIntoView('#contact');
}); 

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if (window.scrollY > homeHeight / 2) {
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project'); //배열로 전부 받아옴
workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if (filter == null) {
        return;
    }

    // Remove selection from the previous item and select the new one.
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
    target.classList.add('selected');

    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            console.log(project.dataset.type);
            if (filter === '*' || filter === project.dataset.type) {
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        });
        projectContainer.classList.remove('anim-out');
    }, 300);

});

// 1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다.
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 한다.

const sectionIds = [//사용된 모든 id를 문자열로 배열로 저장
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#contact'
];

const sections = sectionIds.map(id => document.querySelector(id)); //그것을 이용해서 모든 section요소들을 sections라는 배열에 할당해둠
const navItems = sectionIds.map(id => 
    document.querySelector(`[data-link="${id}"]`)
); //동일하게 navItems에 할당

let selectedNavIndex = 0; //현재 선택된 인덱스와 메뉴요소 저장
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {//section의 id가 인자로 전달
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior:'smooth'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3,
};

const observerCallback = (entries, observer) => { //observer?
    entries.forEach(entry => {
            if (!entry.isIntersecting && entry.intersectionRatio > 0) {
                const index = sectionIds.indexOf(`#${entry.target.id}`);
                // 스크롤링이 아래로 되어서 페이지가 올라옴.
                //다음에 할당되는 index를 selectedIndex로 할당함
                if (entry.boundingClientRect.y < 0) { //y축을 기점으로 
                    selectedNavIndex = index + 1;
                } else {
                    selectedNavIndex = index - 1;
                }
            }
        });
    };

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => { //스크롤 위치가 제일 위 or 아래일때 처리
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (window.scrollY + window.innerHeight === document.body.clientHeight) {
        selectedNavIndex = navItems.length-1;
    }
    selectNavItem(navItems[selectedNavIndex]);//중간
});