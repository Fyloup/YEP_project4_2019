// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

let maxProfileNumber = 20;
let currentCardIdx = 0;
let nextCardIdx = 0;
let source;
let container;
let card;
let titleDiv;
let titleInputDiv;
let titleInput;
let editBtn;
let submitBtn;
let enterBtn;
let removeBtn;
let newContent;
let lastScroll = 0;
let intervalScroll = 300;
let template = {
    "id": null,
    "class": "card-div",
    "title": {
        "text": "Template",
        "class": "title-div"
    },
    "buttons": [
        {
            "name": "edit",
            "icon" : "icon-pencil",
            "class": "edit-btn"
        },
        {
            "name": "remove",
            "icon" : "icon-minus",
            "class": "remove-btn"
        },
        {
            "name": "submit",
            "icon" : "icon-ok",
            "class": "submit-btn"
        },
        {
            "name": "enter",
            "icon" : "icon-login",
            "class": "enter-btn"
        }
    ],
    "inputs": [
        {
            "name": "title",
            "classdiv": "title-input-div",
            "classinput": "title-input"
        }
    ]
}

let classRef = {
    "add-btn": () => {
        
        if (source.cards.length + 1 >= maxProfileNumber) {
            console.log("Trop de cartes")
            return
        }
        let key = source.cards[source.cards.length - 1].id + 1
        // Handle HTML modifs

        //// Handle JSON modifs
        let card = JSON.parse(JSON.stringify(template))
        card.id = key
        card.title.text = "Profile " + key
        source.cards.push(card)
        window.api.send("toMain", "SaveProfiles", source)

        //// Create node
        let node = document.createElement("div")
        node.id = "card-" + key
        node.className = card.class
        console.log("new json: " + JSON.stringify(card))
        createCardAssets(card, node)
        container.appendChild(node)
    },
    "remove-btn": (target) => {
        while (target) {
            if (target.id && target.id.startsWith("card-")) {
                let id = parseInt(target.id.substr("card-".length))
                let idx = source.cards.findIndex((card) => card.id === id)

                container.removeChild(target)
                if (idx >= 0) {
                    if (idx === source.cards.length - 1) {
                        currentCardIdx--
                    }
                    source.cards.splice(idx, 1)
                    window.api.send("toMain", "SaveProfiles", source)

                    let card = document.getElementById("card-" + source.cards[currentCardIdx].id)
                    container.style.left = `calc(-${currentCardIdx} * (var(--card-width) + var(--card-margin)))`
                    card.classList.add("selected-card")
                }
                break
            } else {
                target = target.parentNode
            }
        }
    },
    "edit-btn": (target) => {
        while(target) {
            if (target.id && target.id.startsWith("card-")) {
                let id = parseInt(target.id.substr("card-".length))
                console.log("edit: " + id)
                card = document.getElementById("card-" + id)
                card.classList.toggle("editmode")
                titleDiv = document.getElementById("title-" + id)
                titleInputDiv = document.getElementById("input-div-" + id)
                titleInput = document.getElementById("input-" + id)
                setTimeout(() => {
                    titleDiv.style.display = "none";
                    titleInputDiv.style.display = "block";
                    titleInput.focus()
                }, 200)
                titleInput.value = titleDiv.textContent
                break
            } else {
                target = target.parentNode
            }
        }
    },
    "submit-btn": (target) => {
        while(target) {
            if (target.id && target.id.startsWith("card-")) {
                let id = parseInt(target.id.substr("card-".length))
                let idx = source.cards.findIndex((card) => card.id === id)

                if (titleInput.value !== "") {
                    titleDiv.textContent = titleInput.value
                    source.cards[idx].title.text = titleInput.value
                    window.api.send("toMain", "SaveProfiles", source)
                }
                card.classList.toggle("editmode")
                setTimeout(() => {titleDiv.style.display = "block"; titleInputDiv.style.display = "none"}, 200)
                break
            } else {
                target = target.parentNode
            }
        }
    },
    "enter-btn": (target) => {
        while(target) {
            if (target.id && target.id.startsWith("card-")) {
                let id = parseInt(target.id.substr("card-".length))
                let idx = source.cards.findIndex((card) => card.id === id)

                ///window.api.send("toMain", "ChangePage", "../renaud-front/html/index.html")
                window.api.send("toMain", "ChangePage", "./renaud-front/html/index.html")
                break
            } else {
                target = target.parentNode
            }
        }
    }
}

window.api.receive("fromMain", (type, data) => {
    if (type === "profiles") {
        source = data
        loadUserData(source.cards)
        document.getElementById("loading").style.display = "none"
        document.getElementById("card-" + source.cards[0].id).classList.add("selected-card")
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // setTimeout(() => {
    //     window.api.send("toMain", "send me data")   // For testing purposes
    // },
    // 1000
    // )
    window.api.send("toMain", "SendProfiles")
    container = document.getElementById("container")
    document.body.addEventListener("click", (event) => {
        Object.keys(classRef).forEach((element) => {
            let target = event.target
            while (target) {
                if (target.classList && target.classList.contains(element)) {
                    classRef[element](target)
                    break
                }
                target = target.parentNode
            }
        })
    })

    container.addEventListener('wheel', (event) => {
        let time = Date.now()
        if (time > lastScroll + intervalScroll) {
            let prevCard = document.getElementById("card-" + source.cards[currentCardIdx].id);
            nextCardIdx = currentCardIdx
            if (event.deltaY > 0 && currentCardIdx < source.cards.length - 1 && !prevCard.classList.contains("editmode")) {
                nextCardIdx++
            } else if (event.deltaY < 0 && currentCardIdx !== 0 && !prevCard.classList.contains("editmode")) {
                nextCardIdx--
            }
            if (currentCardIdx !== nextCardIdx) {
                let nextCard = document.getElementById("card-" + source.cards[nextCardIdx].id)
                container.style.left = `calc(-${nextCardIdx} * (var(--card-width) + var(--card-margin)))`
                prevCard.classList.remove("selected-card")
                nextCard.classList.add("selected-card")
                currentCardIdx = nextCardIdx
            }
            lastScroll = time
        }
    })
})

const loadUserData = (data) => {
    let dataLen = data.length

    for (let i = 0; i < dataLen; i++) {
        let node = createNode(data[i])
        createCardAssets(data[i], node)
    }
}

const createNode = (data) => {
    let node = document.createElement("div")

    node.id = "card-" + data.id
    node.className = data.class

    container.appendChild(node)
    return node
}

const createCardAssets = (data, node) => {

    let nbBtns = data.buttons.length
    let nbInputs = data.inputs.length

    // Create title
    let title = document.createElement("div")
    title.id = "title-" + data.id
    title.className = data.title.class
    console.log("card title: " + data.title.text)
    title.textContent = data.title.text

    // Create inputs
    for (let j = 0; j < nbInputs; j++) {
        let div = document.createElement("div")
        div.id = "input-div-" + data.id
        div.className = data.inputs[j].classdiv

        let input = document.createElement("input")
        input.id = "input-" + data.id
        input.className = data.inputs[j].classinput
        div.appendChild(input)
        
        node.appendChild(div)
    }
    // Append to parent
    // source.buttons.forEach((Element, i) => {
        
    // })
    for (let i = 0; i < nbBtns; i++) {

        // Create button
        let button = document.createElement("div")
        button.id = "btn-" + i + "-" + data.id
        button.className = data.buttons[i].class

        // Create button icon
        let icon = document.createElement("i")
        icon.id = "icon-" + i + "-" + data.id
        icon.className = data.buttons[i].icon

        // Append to parent
        button.appendChild(icon)
        node.appendChild(button)
    }
    node.appendChild(title)
}