const cMEStitle = document.getElementById("cMEStitle");
 
var AreaData; 
var L1parentSpan;

var LineData;
var L2parentSpan;

var EquipmentData;
var L3parentSpan;
var L3parentSpanID;
var updatedEquipmentData;
var EquipmentZipname;

var liclosestpopupform;




//window.onload = loadEquipmentData();
////check scoping concept???????

//merit of creating class as well as id.?

//document.addEventListener("DOMContentLoaded", function () {
//do we have to use these methodology ??????????


//Post DOMLoad Actions
document.addEventListener("DOMContentLoaded", function ()
{

    //dropdown show
    var dropdown = document.querySelector("#factnav .dropdown-content");

    document.getElementById("factoryBtn").addEventListener("click", function () {
        dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
    });

   //  Dropdown factories click eventlisten
    dropdown.addEventListener("click", function (event) {

        // Check if the click occurred on an anchors of factorybtn dropdown
        if (event.target.tagName === "A") {
            var factoryelement = event.target.textContent;
            var factoryid = event.target.id;
         /*   var factoryjson = JSON.stringify({ factory: factoryelement });*/

            // Handle click on anchor element
            console.log("Anchor element clicked:", event.target.textContent);

            // Clear all child elements of .tree first child li  in tree area when u click other factories in dropdown
            const treeparentlis = document.querySelectorAll('.tree > ul > li:first-child');
            treeparentlis.forEach(function (treeparentli) {
                treeparentli.innerHTML = ''; // Empty the content
            });


            //add  selected anchor name inside span to (tree class  ul li)first child's li
            const factoryli = document.createElement("span");
            factoryli.innerHTML = factoryelement;
            const treeparentli = document.querySelector('.tree > ul > li:first-child');
            treeparentli.id = factoryid;
            treeparentli.append(factoryli);

            //Main root tree
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------

            $(function () {

              

                // this will check all spans
                $('.tree').on('click', 'li > span', function (e)
                {

                    //common parent_li adding
                 /*   $('.tree li:not(.parent_li)').addClass('parent_li').find(' > span');*/
                    $(this).parent('li').addClass('parent_li');



                    //// this will check only list item's spans with parent_li classes
                    //$('.tree li.parent_li > span').on('click', function (e) {

                    // Count the number of ancestors with the 'parent_li' class
                    var childLevel = $(this).parents('li.parent_li').length;

                    // Log the child level to the console
                    console.log('Click happened at child level:', childLevel);


                    // this will check closest ancestor of clicked span's li item with class 
                    // -parent_li and stoes all its under ul li items in children var
                    var children = $(this).parent('li.parent_li').find(' > ul > li');

                    if (children.is(":visible")) {
                        children.hide('fast');
                        $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus-square').removeClass('fa-minus-square');
                    } else {
                        children.show('fast');
                        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus-square').removeClass('fa-plus-square');
                    }

                    // e.stopPropagation(); is a method that, when called, prevents the event from propagating further in either direction.
                    // If the event is bubbling up (capturing phase), it stops it from reaching higher-level ancestors.
                    // If the event is trickling down (bubbling phase), it stops it from reaching lower-level descendants.
                    e.stopPropagation();

                    ////check for button click
                    //$('.tree').on('click', 'li button.Equipment-button', function (e) {

                    //    function toggleForm() {
                    //        const popupForm = document.querySelector('.popup-form');
                    //        popupForm.classList.toggle('active');
                    //    }
                    //        e.stopPropagation();
                    //    });

                    if (childLevel == 1) // call loadAreaData API
                    {
                        // Reference the parent ul element
                        L1parentSpan = $(this).parent('li.parent_li');
                        var L1parentSpanID = L1parentSpan.attr('id'); // Get the id attribute value
                        // call loadAreaData----------------------
                        loadAreaData(L1parentSpanID, L1AppendAreaElements);


                    }
                    else if (childLevel == 2)// call loadLineData API
                    {

                     // this will check the closest li ancestor with class parent_li
                        L2parentSpan = $(this).parent('li.parent_li');
                        var L2parentSpanID = L2parentSpan.attr('id'); // Get the id attribute value
                        // call loadLineData----------------------
                        loadLineData(L2parentSpanID, L2AppendLineElements);
                    }
                    else if (childLevel == 3)// call loadEquipmentData API
                    {
                        // this will check the closest li ancestor with class parent_li
                        L3parentSpan = $(this).parent('li.parent_li');
                        L3parentSpanID = L3parentSpan.attr('id'); // Get the id attribute value
                        // call loadEquipmentData----------------------
                        loadEquipmentData(L3parentSpanID, L3AppendEquipmentElements);

                    }



                    ////do this with any span click event listner and try to add parent li classes which has uls
                    //        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
                    $('.tree li:has(ul)').find(' > span').attr('title', 'Collapse this branch');

                });
            });



            //----------------------------------------------------------------------------------------------------------------------------------------------------------------

            ////call loadAreaAPI
            //    //1. query areas and store to AreaData variable
            //    //2. execute the callback function listenclickafterAreadata which will listen for tree ul li 1st child onlick then calls appendareadata
            //loadAreaData(factoryid,listenclickafterAreadata);

            dropdown.style.display = "none";

        }
    });


    // Close dropdown when clicking outside of dropdown content
    document.body.addEventListener("click", function (event) {
        // Check if the click is outside the dropdown and not on the factoryBtn
        if (!dropdown.contains(event.target) && event.target.id !== "factoryBtn") {
            dropdown.style.display = "none";
        }
    });




});

function loadFactoryData() {
    var JsonValue;
    $.ajax({
        url: '/Home/loadFactoryAPI',
        type: "Post",
        dataType: "json",
        /*       data: null,*/
        contentType: "application/json",
        cache: false,
        success: function (response) {
            if (response.length > 0) {
                console.log(response);
                var dropdown = document.querySelector("#factnav .dropdown-content");
                //// Your array of options
                //var factories = ["Option 1", "Option 2", "Option 3"];

                // Create anchor elements and append them to the dropdown
                response.forEach(function (factory) {
                    var anchor = document.createElement("a");
                    anchor.href = "#";  // Set the href attribute as needed
                    anchor.textContent = factory.FACTORY_NAME;
                    anchor.id = factory.FACTORY_ID;
                    dropdown.appendChild(anchor);

                });      
            }
            else {
                alert('No data or an error occurred.');
            }
        }
    })
    return JsonValue;
}

window.onload = loadFactoryData();


function loadAreaData(L1parentSpanID, callback){
    var JsonValue;
    $.ajax({
        url: '/Home/loadAreaAPI?factoryID=' + L1parentSpanID,
        type: "Get",
        dataType: "json",
        //data: factoryjson,
        contentType: "application/json",
        cache: false,
        success: function (response)
        {
            if (response.length > 0)
            {
                AreaData = response;
                console.log(AreaData);
                callback();
            }
        
            else
            {
                alert('No data or an error occurred.');
            }
        }
    })
    return JsonValue;
}

function loadLineData(L2parentSpanID,callback) {
    var JsonValue;
    $.ajax({
        url: '/Home/loadLineAPI?AreaID=' + L2parentSpanID,
        type: "Get",
        dataType: "json",
        //data: factoryjson,
        contentType: "application/json",
        cache: false,
        success: function (response) {
            if (response.length > 0) {
                LineData = response;
                console.log(LineData);
                // add Line data to HTML DOM
                callback();
            }

            else {
                alert('No data or an error occurred.');
            }
        }
    })
    return JsonValue;

}

function loadEquipmentData(L3parentSpanID, callback) {
    var JsonValue;
    $.ajax({
        url: '/Home/loadEquipmentAPI?LineID=' + L3parentSpanID,
        type: "Get",
        dataType: "json",
        //data: factoryjson,
        contentType: "application/json",
        cache: false,
        success: function (response) {
            if (response.length > 0) {
                EquipmentData = response;
/*                console.log(EquipmentData);*/
                // add Line data to HTML DOM
                callback();
            }

            else {
                alert('No data or an error occurred.');
            }
        }
    })
    return JsonValue;

}

function updateEquipmentData(callback) {
    $.ajax
        ({
        url: '/Home/updateEquipmentAPI',
        type: "Post",
        dataType: "text",
        data: JSON.stringify(updatedEquipmentData),
        contentType: "application/json",
        cache: false,
            success: function (response)
            {
                if (response === "OK")
                {
                    console.log("updateequipment API called");
                    callback();
                }
                else
                {
                    alert("error occured")
                }
            }
        })
}



function L1AppendAreaElements() {
    // Check if there are child ul or li elements
    if (L1parentSpan.find('ul, li').length === 0) {
        // Create a new ul element
        var newUl = $('<ul></ul>');

        // Iterate through the array and create li elements
        AreaData.forEach(function (Area) {
            var areastr = Area.AREA_NAME; // Assuming your object property is AREA_NAME
            var areaid = Area.AREA_ID;
            // Create li element with the stringified name
            var liElement = $('<li id=' + areaid + '><span><i class="' + Area.iconClass + '"></i>' + areastr + '</span></li>');
            // Append li element to the new ul
            newUl.append(liElement);
        });

        // Append the new ul element to the existing li
        L1parentSpan.append(newUl);
    }
}


function L2AppendLineElements() {

    // Check if there are child ul or li elements
    if (L2parentSpan.find('ul, li').length === 0) {
        // Create a new ul element
        var newUl = $('<ul></ul>');

        // Iterate through the array and create li elements
        LineData.forEach(function (Line) {
            var Linestr = Line.LINE_NAME; // Assuming your object property is AREA_NAME
            var Lineid = Line.LINE_ID;
            // Create li element with the stringified name
            var liElement = $('<li id=' + Lineid + '><span><i class="' + Line.iconClass + '"></i>' + Linestr + '</span></li>');
            // Append li element to the new ul
            newUl.append(liElement);
        });

        // Append the new ul element to the existing li
        L2parentSpan.append(newUl);
    }
}


function L3AppendEquipmentElements() {

    // Check if there are child ul or li elements
    if (L3parentSpan.find('ul, li').length === 0) {
        // Create a new ul element
        var newUl = $('<ul></ul>');

        // Iterate through the array and create li elements
        EquipmentData.forEach(function (Equipment) {
            var Equipmentstr = Equipment.EQUIPMENT_NAME; // Assuming your object property is AREA_NAME
            var Equipmentid = Equipment.EQUIPMENT_ID;

            // Create li element with the stringified name
            //Button to open the popup form, Container to dynamically insert the popup form
            /*var liElement = $('<li id=' + Equipmentid + '><span><i class="' + Equipment.iconClass + '"></i>' + Equipmentstr + '</span><button class="image-button Equipment-button" ></button><div id="popup-elements"></div></li>');*/



            // HTML template for the popup form with placeholders
            // ASSigning pop-form's id as eqp code for calling this eqp code popup form at onclick
            var popupFormTemplate = `
                        <div class="popup-container">
                            <div class="popup-form" id="${Equipment.EQUIPMENT_CODE}"> 
                                <div class="form-content">
                                    <span class="close-btn" onclick="closePopup()" >&times;</span>
                                    <h2 id="popupformh2">${Equipment.EQUIPMENT_NAME} Details</h2>
            
                                    <div class="form-row">
                                        <label for="equipmentId">EQUIPMENT_ID:</label>
                                        <input type="text" id="equipmentId" name="equipmentId" value="${Equipment.EQUIPMENT_ID}" disabled>
                                    </div>
            
                                    <div class="form-row">
                                        <label for="equipmentCode">EQUIPMENT_CODE:</label>
                                        <input type="text" id="equipmentCode" name="equipmentCode" value="${Equipment.EQUIPMENT_CODE}">
                                    </div>
            
                                    <div class="form-row">
                                        <label for="equipmentName">EQUIPMENT_NAME:</label>
                                        <input type="text" id="equipmentName" name="equipmentName" value="${Equipment.EQUIPMENT_NAME}">
                                    </div>


                                    <div class="form-row">
                                        <label for="lastBackupTime">LAST_BACKUP_TIME:</label>
                                        <input type="text" id="lastBackupTime" name="lastBackupTime" value="${Equipment.LAST_BACKUP_TIME}" disabled>
                                    </div>
            
                                    <div class="form-row">
                                        <label for="appDirectory">APP_DIRECTORY:</label>
                                        <input type="text" id="appDirectory" name="appDirectory" value="${Equipment.APP_DIRECTORY}">
                                    </div>
            
                                    <div class="form-row">
                                        <label for="backupDirectory">BACKUP_DIRECTORY:</label>
                                        <input type="text" id="backupDirectory" name="backupDirectory" value="${Equipment.BACKUP_DIRECTORY}">
                                    </div>
            
                                    <div class="form-row">
                                        <button class="save-btn">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;

            //// Now, popupFormTemplate contains the HTML with actual values
            //console.log(popupFormTemplate);

            var liElement = $('<li id=' + Equipmentid + '><span><i class="' + Equipment.iconClass + '"></i>' + Equipmentstr + '</span><button class="image-button Equipment-button" ></button><button class="image-button Download-button"></button><div id="popup-elements"></div>' + popupFormTemplate +'</li>');

        /*    newUl.append([liElement, popupFormTemplate]);*/
            newUl.append(liElement);
        });

        // Append the new ul element to the existing li
        L3parentSpan.append(newUl);
        // adding popupFormTemplate

        document.addEventListener('click', function (event) {
            // Check if the clicked element or any of its ancestors contain either "image-button" or "Equipment-button"
            if (event.target.closest('.Equipment-button')) {
                liclosestpopupform = event.target.closest('li');
                // The clicked element or its ancestor has either "image-button" or "Equipment-button"
                openPopup(event);
            }
            if (event.target.closest('.Download-button')) {
                liclosestpopupform = event.target.closest('li');
                // The clicked element or its ancestor has either "image-button" or "Equipment-button"
                console.log("download backup zip")
                var backupDirectorypath = liclosestpopupform.querySelector('#backupDirectory').value;
                EquipmentZipname = liclosestpopupform.querySelector('#equipmentCode').value;
                DownloadLastModifiedZip(backupDirectorypath);
            }
        });

    }
}

//only for updating Equipment elements after updateEquipmentData is completed
function L3updatelatestEqpElements() {
    console.log(EquipmentData);
    // Check if there are child ul or li elements
    if (L3parentSpan.find('ul, li').length != 0) {

        // Iterate through the array and create li elements
        function findEquipmentById(equipmentId) {
            return EquipmentData.find(function (equipment) {
                // Convert equipmentId to an integer
                var equipmentIdInt = parseInt(equipmentId, 10); // Use parseInt with radix 10
                return equipment.EQUIPMENT_ID === equipmentIdInt;
            });
        }

        // Example usage
        var liclosestpopupformid = liclosestpopupform.id;
        var foundEquipment = findEquipmentById(liclosestpopupformid);

        if (foundEquipment) {
            console.log("Found Equipment:", foundEquipment);

            // Select the span element within liclosestpopupform
            var span = liclosestpopupform.querySelector('span');
                // Change the inner HTML content of the span
                span.innerHTML = foundEquipment.EQUIPMENT_NAME;

   /*         equipmentIdValue = popupContainer.querySelector('#equipmentId').value;*/
            liclosestpopupform.querySelector('#equipmentCode').value = foundEquipment.EQUIPMENT_CODE;
            liclosestpopupform.querySelector('#equipmentName').value = foundEquipment.EQUIPMENT_NAME;
            liclosestpopupform.querySelector('#lastBackupTime').value = foundEquipment.LAST_BACKUP_TIME;
            liclosestpopupform.querySelector('#appDirectory').value = foundEquipment.APP_DIRECTORY;
            liclosestpopupform.querySelector('#backupDirectory').value = foundEquipment.BACKUP_DIRECTORY;
            liclosestpopupform.querySelector('#popupformh2').innerHTML = foundEquipment.EQUIPMENT_NAME + " Details"

            // Perform any action with the updated values (e.g., update a JavaScript object)
            console.log("updated span cont and li id");

        }

    }
}



function openPopup(event) {
    //// call latest update eqp elements to load form with latest eqp data
    L3updatelatestEqpElements();

    // Insert the popup form into the DOM
    var popupForm = liclosestpopupform.querySelector('.popup-form');
    popupForm.classList.toggle('active');

        //check for savebtn click
    popupForm.addEventListener('click', function (event)
    {
            var saveButton = event.target.closest('.save-btn');

            if (saveButton)
            {
                // Retrieve the updated values from the form
                updatedEquipmentData =
                {
                    EQUIPMENT_ID: popupForm.querySelector('#equipmentId').value,
                    EQUIPMENT_CODE: popupForm.querySelector('#equipmentCode').value,
                    EQUIPMENT_NAME: popupForm.querySelector('#equipmentName').value,
                    APP_DIRECTORY: popupForm.querySelector('#appDirectory').value,
                    BACKUP_DIRECTORY: popupForm.querySelector('#backupDirectory').value,
                    LAST_BACKUP_TIME: popupForm.querySelector('#lastBackupTime').value
                    // Add other properties as needed
                };

                ////after updating in DB next callback the loadEquipmentData for storing latest data to var EquipmentData
              /*  updateEquipmentData();*/
                updateEquipmentData(function () {
                    loadEquipmentData(L3parentSpanID, L3updatelatestEqpElements);
                });

                ////after loading latest equipment data call latest equipment elements
                //loadEquipmentData(L3parentSpanID, L3updatelatestEqpElements);




                // Toggle the "active" class for the popup form
                popupForm.classList.remove('active');
            }

        });

}

function closePopup() {
    const popupForm = liclosestpopupform.querySelector('.popup-form');
    popupForm.classList.toggle('active');
    // Clear the popup form from the DOM
    //document.getElementById('popup-elements').innerHTML = '';
    //const popupForm = document.querySelector('.popup-form');

}




//    }
//    //-------------------------------------------------------------------------------------

//    //// start listener 3nd level ul li span clicks
//    //$('.tree ul > li > ul > li > span').on('click', function (event) {
//    //    var AreaID = event.target.id;
//    //    loadLineData(AreaID);
//    //});
//    //$('parentSpanAreaLevelli :has(ul):not(.parent_li)').addClass('parent_li').find('> span').attr('title', 'Collapse this branch');

//    parentSpanAreaLevelli.filter(':has(ul):not(.parent_li)').addClass('parent_li').find('> span').attr('title', 'Collapse this branch');

//}








function BackupAPI() {
    var backupres;
    $.ajax({
        url: '/Home/ZipAndMove',
        type: "Post",
        dataType: "json",
        /*       data: null,*/
        contentType: "application/json",
        cache: false,
        success: function (response) {
            if (response.success) {
                console.log(response.message);
            }

            else {
                alert(response.error);
            }
        },
        Error: function (error) {
            alert(error.statustext);
        }
    })
    return backupres;
}




function DownloadLastModifiedZip(backupDirectorypath)
{
    fetch('/Home/DownloadLastModifiedZipAPI?backupDirectorypath=' + backupDirectorypath, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response is not good");
            }
            return response.blob();

        })
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = EquipmentZipname+"_Backup.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


