let isLogged = localStorage.getItem("logged");
//generate random numbers for user who is not registred
let randomUserName = () =>{
    let userName = document.querySelector('.user p');
    let randomNumber =  Math.random() * 1000;
    userName.innerText += parseInt(randomNumber);
}
//import data from API
let body = document.querySelector('.car-list');

let dataLoad = () =>{

    fetch(`./cars.json`)
            .then(
                r => {
                    if (r.status !== 200) {
                        alert("Server javlja grešku: " + r.status);
                        return;
                    }

                    r.json().then(obj => {
                        for (const x of obj) {
                            body.innerHTML +=`<div class="car">
                            <div class="carImage">
                                <img src="${x.image}" alt="">
                            </div>
                            <div class="carTitle">
                                <p>${x.name}</p>
                            </div>
                            <div class="carPerInfo">
                                <p>${x.price}KM/dan</p>
                                <button onclick="showPaymentType(this);  handleData(this)">Rezervisi</button>
                            </div>
                            <div class="carDetails" onclick="showDetails(this)">
                                <p>Detalji o automobilu</p>
                            </div>
                            <div class="detailsInfo">
                                <div class="informations">
                                    <p>Klasa: ${x.class}</p>
                                    <p>Gorivo: ${x.fuel}</p>
                                    <p>Broj vrata: ${x.doors}</p>
                                </div>
                                <div class="informations">
                                    <p>Motor: ${x.engine} cm3</p>
                                    <p>Snaga: ${x.power} KW</p>
                                    <p>Godina: ${x.year}</p>
                                </div>
                            </div>
                        </div>`
                        }
                    });
                }
            )
            .catch(
                err => {
                    alert("Error: " + err);
                }
            );
}
dataLoad();
function handleData(element) {
    let parentElement = element.closest('.car');

    let carImage = parentElement.querySelector('.carImage img').getAttribute('src');
    let carTitle = parentElement.querySelector('.carTitle').innerText;
    let carPerInfo = parentElement.querySelector('.carPerInfo p').innerText;
    let username = document.querySelector('.user p').innerText;

    let reservation ={
        image: carImage,
        title: carTitle,
        info: carPerInfo,
        user: username
    }
    localStorage.setItem("reservations",JSON.stringify(reservation));
    
}

let realBody = document.querySelector('body');
let paymentBody = document.querySelector('.car-container');

let isOpened = false;

let showPaymentType = (element) =>{
    isOpened = !isOpened;
    if(isOpened === true)
    {
    let paymentMethod = document.createElement('div');
    paymentMethod.innerHTML = `<div class="payment-container">
    <h1>Odaberite nacin placanja</h1>
        <div class="radioInput">
        <div class="cashPayment">
          <input type="radio" id="cash" name="fav_language" value="cash">
          <label for="cash">Gotovina</label><br>
        </div>
        <div class="creditCardPayment">
          <input type="radio" id="creditCard" name="fav_language" value="creditCard">
          <label for="creditCard">Kartica</label><br>
        </div>
        </div>
        <div class="buttonComands">
        <button onclick="backToPage()">Odustani</button>
        <button onclick="goToNextPage()">Nastavi</button>
        </div>
    </div>`
    paymentBody.appendChild(paymentMethod);
    realBody.style.overflowY = 'hidden';
    userContainer.removeEventListener('click',pageEdit);
    }
}

let goToNextPage = () =>{
    let checkedCreditCard = false;
    let checkedCash = false;

    let cashPayment = document.querySelector('.cashPayment input');
    let creditCardPayment = document.querySelector('.creditCardPayment input');

    if(cashPayment.checked === true){
        checkedCash = true;
    }
    if(checkedCash === true){
        if(isLogged === "true"){
            alert('Rezervacija uspjesno izvrsena');
            let reservationData = localStorage.getItem("reservations");
            let reservationDataTemp = JSON.parse(reservationData);

            let newObj = {
                foto: reservationDataTemp.image,
                car: reservationDataTemp.title,
                location: localStorage.getItem("recieveLocation"),
                dater: localStorage.getItem("recieveDate"),
                timer: localStorage.getItem("recieveTime"),
                dateb: localStorage.getItem("returnDate"),
                timeb: localStorage.getItem("returnTime"),
                byuser: reservationDataTemp.user
            }
            fetch('https://65665f6864fcff8d730ebcb1.mockapi.io/Reservations', {
        method: "POST",
        body: JSON.stringify(newObj),
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(r => {

            r.json().then(t => {
                window.location.href = '/Welcome/welcome.html';
                localStorage.removeItem("reservations");
                localStorage.removeItem("recieveLocation");
                localStorage.removeItem("recieveDate");
                localStorage.removeItem("recieveTime");
                localStorage.removeItem("returnDate");
                localStorage.removeItem("returnTime");
            })

        })
        }
        else{
            window.location.href = "/orderNonReg/orderNonReg.html";
        }
    }
    if(creditCardPayment.checked === true){
        checkedCreditCard = true;
    }
    if(checkedCreditCard === true){
        if(isLogged === "true"){
            window.location.href ="/creditCard/creditCard.html";
        }
        else{
            window.location.href = "/orderNonReg/orderNonReg.html";
            localStorage.setItem("nonLogged",true);
        }
    }
}

let backToPage = () => {
    let paymentContainer = document.querySelector('.payment-container');
    paymentContainer.remove();
    realBody.style.overflowY = 'scroll';
    userContainer.addEventListener('click',pageEdit);
    isOpened = false;
    localStorage.removeItem("reservations")
}

let counter = 0;

let showDetails = (element) =>{
    let parentElement = element.parentElement;

    let carImage = parentElement.querySelector('.carImage');
    let carTitle = parentElement.querySelector('.carTitle');
    let carPerInfo = parentElement.querySelector('.carPerInfo');
    let carDetails = parentElement.querySelector('.carDetails');

    let detailsDiv = parentElement.querySelector('.detailsInfo');
    counter++;
    if(counter % 2 !== 0){
        detailsDiv.style.display = 'flex';
        carImage.style.display = 'none';
        carTitle.style.display = 'none';
        carPerInfo.style.display = 'none';
        carDetails.style.marginTop = "200px";
    }
    else{
        detailsDiv.style.display = 'none';
        carImage.style.display = 'block';
        carTitle.style.display = 'block';
        carPerInfo.style.display = 'flex';
        carDetails.style.marginTop = "30px";
    }
    
}
randomUserName();

//navigation to editProfile page
let userContainer = document.querySelector('.user');

let pageEdit = () =>{
    window.location.href = '/EditProfile/editProfile.html';
}

userContainer.addEventListener('click',pageEdit);

//responsive price range slider

let priceSlider = document.querySelector('.slider input');
let beginPrice = document.querySelector('.startPrice');
priceSlider.addEventListener('change',()=>{
    let priceValue = priceSlider.value;
    beginPrice.innerText = priceValue + 'KM';
})

//filtering data

function filterData() {
    let dropDownListClass = document.getElementById('class');
    let dropDownListFuel = document.getElementById('fuel');

    let sliderPrice = document.querySelector('.slider input');
    let maxPrice = 220;
    let currentPrice = parseInt(sliderPrice.value);

    body.innerHTML = ``;
    fetch(`./cars.json`)
            .then(
                r => {
                    if (r.status !== 200) {
                        alert("Server javlja grešku: " + r.status);
                        return;
                    }

                    r.json().then(obj => {
                        for (const x of obj) {
                            if((dropDownListClass.value === x.class && dropDownListFuel.value === x.fuel && x.price >= currentPrice) || 
                            (dropDownListClass.value === x.class && dropDownListFuel.value === '' && x.price >=currentPrice) ||
                            (dropDownListClass.value === '' && dropDownListFuel.value === x.fuel && x.price >=currentPrice) ||
                            (dropDownListClass.value === '' && dropDownListFuel.value === '' && x.price >=currentPrice)
                            )
                            {
                            body.innerHTML +=`<div class="car">
                            <div class="carImage">
                                <img src="${x.image}" alt="">
                            </div>
                            <div class="carTitle">
                                <p>${x.name}</p>
                            </div>
                            <div class="carPerInfo">
                                <p>${x.price}KM/dan</p>
                                <button onclick="showPaymentType(this); handleData(this)">Rezervisi</button>
                            </div>
                            <div class="carDetails" onclick="showDetails(this)">
                                <p>Detalji o automobilu</p>
                            </div>
                            <div class="detailsInfo">
                                <div class="informations">
                                    <p>Klasa: ${x.class}</p>
                                    <p>Gorivo: ${x.fuel}</p>
                                    <p>Broj vrata: ${x.doors}</p>
                                </div>
                                <div class="informations">
                                    <p>Motor: ${x.engine} cm3</p>
                                    <p>Snaga: ${x.power} KW</p>
                                    <p>Godina: ${x.year}</p>
                                </div>
                            </div>
                        </div>`
                            }
                        }
                    });
                }
            )
            .catch(
                err => {
                    alert("Error: " + err);
                }
            );

}
const getInfoLogged = localStorage.getItem("logged");

if(getInfoLogged === "true"){
    const loggedUsername = localStorage.getItem("loginUsername");
    let userNameDiv = document.querySelector('.user p');
    userNameDiv.innerText = loggedUsername;
}