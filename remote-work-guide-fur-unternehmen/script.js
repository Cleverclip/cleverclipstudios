const nav__categories = document.querySelectorAll('.guide__faq__nav__categorie')
const nav__questions = document.querySelectorAll('.guide__faq__nav__categorie__questions__container ul li')
const nav__categories__title = document.querySelector('.guide__faq__nav__categories__title')

const content__categories = document.querySelectorAll('.guide__faq__categorie')
const content__categories__title = document.querySelectorAll('.guide__faq__categorie__tagline')
let categorieIndex
let questionIndex 
let limitIndex 

const answers = document.querySelectorAll('.guide__faq__categorie__answer')
let mobile = window.innerWidth < 800 ? true : false

const buttonContainer = document.querySelector('.guide__faq__content__button__container')
const buttonBack = document.querySelector('.guide__faq__content__back')
const buttonNext = document.querySelector('.guide__faq__content__next')

const containers = document.querySelectorAll('.guide__faq__categorie__answer__container')
let l = 0
let limits = []



for(let i = 0; i < containers.length; i++){
    l += containers[i].children.length
    limits.push(l-1)
}




window.addEventListener('resize',() =>{
    if(mobile){
        for(let i = 0; i < content__categories__title.length; i++){
            content__categories__title[i].classList.remove('active')
        }
    }
})
buttonNext.addEventListener('click',() =>{
    if(questionIndex >= answers.length - 1)return
    questionIndex += 1
    if(questionIndex > limits[limitIndex]){
        
        if(limitIndex > limits.length) return
        limitIndex += 1
        let categorie = nav__categories[limitIndex]
        for(let i = 0; i < nav__categories.length; i ++){
            
            nav__categories[i].classList.remove('active')
            nav__categories[i].classList.add('hidden')
        }
        categorie.classList.remove('hidden')
        categorie.classList.add('active')
    }
    for(let i = 0; i < answers.length; i ++){
        answers[i].classList.remove('active')
    }
    
    answers[questionIndex].classList.add('active')
})
buttonBack.addEventListener('click',() =>{
    if(questionIndex == 0)return
    questionIndex -= 1
    
    if(questionIndex <= limits[limitIndex - 1]){
        
        limitIndex -= 1
        let categorie = nav__categories[limitIndex]
        for(let i = 0; i < nav__categories.length; i ++){
            
            nav__categories[i].classList.remove('active')
            nav__categories[i].classList.add('hidden')
        }
        categorie.classList.remove('hidden')
        categorie.classList.add('active')
    }

    for(let i = 0; i < answers.length; i ++){
        answers[i].classList.remove('active')
    }
    
    answers[questionIndex].classList.add('active')
})

if(mobile){
    for(let i = 0; i < content__categories__title.length; i++){
        content__categories__title[i].classList.remove('active')
    }
}

for(let i = 0; i < nav__categories.length; i ++){
    const categorie = nav__categories[i]
    
    
    categorie.addEventListener('click',(e) =>{
        let mobile = window.innerWidth < 500 ? true : false
        if(mobile){
            if(categorie.classList.contains('active')){
                if(e.target.classList.contains('guide__faq__nav__categorie__questions__container'))return
                for(let i = 0; i < nav__categories.length; i ++){
                    nav__categories[i].classList.remove('active','hidden')
                }
                for(let i = 0; i < answers.length; i ++){
                    answers[i].classList.remove('active')
                }
                nav__categories__title.classList.remove('hidden')
                buttonContainer.classList.remove('active')
                categorie.classList.remove('active')
            }else{
                for(let i = 0; i < nav__questions.length; i ++){
                    nav__questions[i].classList.remove('active')
                }
                content__categories__title[i].classList.add('active')

                categorie.classList.toggle('active')
                nav__categories__title.classList.add('hidden')
                categorieIndex = i
                for(let i = 0; i < nav__categories.length; i ++){
                        if(nav__categories[i] != categorie){
                            nav__categories[i].classList.remove('active')
                            nav__categories[i].classList.add('hidden')
                        }
                        content__categories__title[i].classList.remove('active')

                        for(let i = 0; i < answers.length; i ++){
                            answers[i].classList.remove('active')
                        }
                    }
                    const questionToload = limits[i]-containers[i].children.length + 1
                    answers[questionToload].classList.add('active')
                    questionIndex = parseInt(questionToload)
                    limitIndex = i
                    buttonContainer.classList.add('active')
                }
        }else{
            if(categorie.classList.contains('active')){
                if(e.target.classList.contains('guide__faq__nav__categorie__questions__container'))return
                for(let i = 0; i < nav__categories.length; i ++){
                    nav__categories[i].classList.remove('active','hidden')
                }
                for(let i = 0; i < answers.length; i ++){
                    answers[i].classList.remove('active')
                }
                content__categories__title[i].classList.add('active')
                nav__categories__title.classList.remove('hidden')
                
            }else{
                for(let i = 0; i < nav__categories.length; i ++){
                    if(nav__categories[i] != categorie){
                        nav__categories[i].classList.remove('active')
                        nav__categories[i].classList.add('hidden')
                    }
                    content__categories__title[i].classList.remove('active')

                    for(let i = 0; i < answers.length; i ++){
                        answers[i].classList.remove('active')
                    }
                }
                for(let i = 0; i < nav__questions.length; i ++){
                    nav__questions[i].classList.remove('active')
                }
                content__categories__title[i].classList.add('active')

                categorie.classList.toggle('active')
                nav__categories__title.classList.add('hidden')
                categorieIndex = i
            }
        }   
    })
}

for(let i = 0; i < nav__questions.length; i ++){
    const question = nav__questions[i]
    question.addEventListener('click',(e) =>{
        e.stopPropagation()
        for(let i = 0; i < nav__questions.length; i ++){
            if(nav__questions[i] != question) nav__questions[i].classList.remove('active')
        }
        for(let i = 0; i < answers.length; i ++){
            answers[i].classList.remove('active')
        }

        answers[i].classList.add('active')
        content__categories__title[categorieIndex].classList.remove('active')
        question.classList.add('active')
    })
}