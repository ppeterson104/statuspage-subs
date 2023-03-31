
document.addEventListener('DOMContentLoaded', function () {

    $('#subscriber_table').hide();

});

window.fileAPI.getUserData().then((userDataPath) => {

    if (!window.fileAPI.checkFileExists(userDataPath, "components.json")) {

        let dialogConfig = { title: "Missing Data", message: "There does not appear to be any data for Statuspage components. Would you like to download and store that data?", buttons: ["Yes", "No"], }

        window.electron.dialog('showMessageBox', dialogConfig).then(result => {


            if (result.response === 0) {

                console.log("Yes was clicked!");

                window.statusPageAPI.getComponents();

            }

        })

    } else {

        let dateCheck = new Date();
        let fileDate = window.fileAPI.getCreatedDate(userDataPath, "components.json");
        dateCheck.setDate(dateCheck.getDate() - 15)

        if (fileDate < dateCheck) {

            let dialogConfig = { title: "Stale Data", message: "The stored data for Statuspage components appears to be stale. Would you like to download and update?", buttons: ["Yes", "No"], }

            window.electron.dialog('showMessageBox', dialogConfig).then(result => {


                if (result.response === 0) {

                    console.log("Yes was clicked!");

                    window.statusPageAPI.getComponents();

                }

            })

        }

    }

    if (!window.fileAPI.checkFileExists(userDataPath, "subscribers.json")) {

        let dialogConfig = { title: "Missing Data", message: "There does not appear to be any data for Statuspage subscribers. Would you like to download and store that data?", buttons: ["Yes", "No"], }

        window.electron.dialog('showMessageBox', dialogConfig).then(result => {


            if (result.response === 0) {

                window.statusPageAPI.getSubscribers();

            }

        })

    }


})





//load jQuery
//window.jQuery.load()