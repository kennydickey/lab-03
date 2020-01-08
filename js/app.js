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
        $newSection.find('img').attr('src', this.url).css({"width":"400px"});
        $newSection.find('p').text(this.description);

        //put onto the doc
        $('main').append($newSection);
    }

    $.ajax('./data/page-1.json', { method: "GET", dataType: "JSON" })
        .then((data) => {
            data.forEach((animal) => {
                const unit = new PrintImg(animal);
                console.log("getting here")
                unit.render();
            })
        })

        




})