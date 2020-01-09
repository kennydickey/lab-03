$(document).ready(() => {

    console.log("hello");



    function PrintImg(image) {
        this.url = image.image_url;
        this.title = image.title;
        this.description = image.description;
        this.keyword = image.keyword;
        this.horns = image.horns;
    }


    PrintImg.prototype.render = function () {
        const template = $('#photo-template').html();
        const $newSection = $('<section></section>');

        $newSection.html(template);
        $newSection.find('h2').text(this.title);
        $newSection.find('img').attr('src', this.url).css({ "width": "400px" });
        $newSection.find('p').text(this.description);

        //put onto the doc
        $('main').append($newSection);

    }

    const createMenu = (optionsArr) => {
        optionsArr.forEach(option => { //for every element on menuOptions, ...
            const $option = $(`<option>${option}</option>`); // create a new option HTML element.
            // $option.text(option); // put the word onto the <option>
            $('select').append($option); //put the <option> into the <select>
        })
    }



    const renderAnimals = (data, selection) => {
        //filter the animals array to be only the ones that match "rhino" keyword.
        let filteredArray = [];
        if (selection !== "default") {
            filteredArray = data.filter(animal => animal.keyword === selection);
            console.log(filteredArray);
        } else {
            filteredArray = data;
        }

        //for each animal on the filtered array of animals, run it through the constructor, assign that to UNIT, then render the unit.
        filteredArray.forEach(animal => {
            const unit = new PrintImg(animal);
            unit.render();
        })
    }


    const clearAnimals = () => {
        $('section').not("#photo-template").html('');
    }



    $.ajax('./data/page-1.json', { method: "GET", dataType: "JSON" })
        .then((data) => {
            const menuOptions = []

            //for each animal, create a menu item, and an animal OBJECT.
            data.forEach((animal) => {
                const unit = new PrintImg(animal);
                if (!menuOptions.includes(unit.keyword)) { menuOptions.push(unit.keyword) }
            })

            //select all <option>s, and when they are clicked, return its text.

            createMenu(menuOptions);
            renderAnimals(data, "default");


            $('select').on('change', function () {
                console.log($(this).val());
                clearAnimals();
                renderAnimals(data, $(this).val());
            })


        })


})
