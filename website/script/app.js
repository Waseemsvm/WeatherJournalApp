const API_KEY = 'fd8ef3061871c7bcb9043693b0d65d2a';
let units = "imperial";
let rButton = document.querySelector("#generate");
rButton.addEventListener("click", handleGenerate);

/**
 * @desctiption - handler function for the click event of the generate function
 * @param {Event} oEvent 
 */

async function handleGenerate(oEvent) {

    updateStatus("Fetching data...")

    /**
     * @description promise chained to fetch the data and update the UI accordingly.
     */
    postData().then(async bStatus => {
        if (!bStatus) throw new Error("data could not be posted.");
        return await fetch("/getData", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }).then(async data => {
        let result = await data.json();
        fnUpdateUI(result)
    }).catch(err => {
        fnUpdateUI({ temp: "", date: "", content: "" })
        console.error(err);
    })
}

/**
 * @description standalone function to handle the sending of processed data to the server for storage.
 * @returns boolean
 */
async function postData() {
    /**
     * @type {HTMLElement} - reference to input field  with zipcode
     */
    let rInputField = document.querySelector("#zip");
    /**
     * @type { string } - entered zipcode value
     */
    let sZipCode = rInputField.value;
    /**
     * @type {string} - the uri to fetch the data from
     */
    const sUri = `https://api.openweathermap.org/data/2.5/weather?zip=${sZipCode},us&appid=${API_KEY}&units=${units}`;
    /**
     * @type {boolean} - returns true if the data posted successfully else false
     */
    let bStatus = false;

    try {
        let data = await fetch(sUri);
        let result = await data.json();

        if (result.cod !== 200) {
            updateStatus(result.message);
            throw new Error(result.message);
        } else {
            await fetch("/setData", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ date: result.dt, temp: result.main.temp, content: document.querySelector("#feelings").value })
            })
            bStatus = true;
            updateStatus("Data Loaded")
        }
    } catch (err) {
        console.error(err)
    }
    return bStatus;
}

/**
 * @description - updates the status of the ui with message
 * @param {string} sMessage 
 */
function updateStatus(sMessage) {
    document.querySelector(".status").innerHTML = sMessage;
}


/**
 * @description - updates the ui with the result.
 * @param {object} result 
 */
const fnUpdateUI = function (result) {
    let aMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let date = new Date();
    let fulldate = date.getUTCDate() + "<sup>th</sup> " + (aMonths[date.getUTCMonth()]) + ", " + date.getFullYear();
    document.querySelector("#date").innerHTML = fulldate;
    document.querySelector("#temp").innerHTML = result.temp || + " degrees";
    document.querySelector("#content").innerHTML = result.content;
}