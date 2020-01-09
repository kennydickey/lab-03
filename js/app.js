$(document).ready(() => {

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
    $newSection.find('img').attr('src', this.url);
    $newSection.find('p').text(this.description);
    $newSection.find('#horns').text(this.horns);


    //put onto the doc
    $('main').append($newSection);

  }

  const createFilterMenu = (optionsArr) => {
    optionsArr.forEach(option => { //for every element on menuOptions, ...
      const $option = $(`<option>${option}</option>`); // create a new option HTML element.
      // $option.text(option); // put the word onto the <option>
      $('#filter').append($option); //put the <option> into the <select>
    })
  }

  const createSortMenu = () => {
    const options = ['Number of Horns', 'Title'];
    options.forEach(option => {
      const newOption = $(`<option>${option}</option>`);
      $('#sort-by').append(newOption);
    })
  }



  const renderAnimals = (data, selection) => {
    //filter the animals array to be only the ones that 'rhino' keyword.
    let filteredArray = [];
    if (selection !== 'default') {
      filteredArray = data.filter(animal => animal.keyword === selection);
    } else {
      filteredArray = data;
    }

    //for each animal on the filtered array of animals, run it through the constructor, assign that to UNIT, then render the unit.
    filteredArray.forEach(animal => {
      const unit = new PrintImg(animal);
      unit.render();
    })
  }


  const clearAnimalsAndMenu = () => { //clear
    $('main').empty();
    $('#filter').empty(); //empty the select menu
    const $newDefaultOption = $(`<option value="default" id="filter">Filter by Keyword</option>`);  //create new variable which has default option text
    $('#filter').append($newDefaultOption);//append the select menu with the new variable.
  }

  const clearAnimals = () => {
    $('main').empty();
  }

  const pages = ['./data/page-1.json', './data/page-2.json']; //here is a list of available pages
  let currentPage = pages[0]; //this is going to store (tell the computer) which page it is on.


  //when page toggle clicked...
  $('#switch').on('click', () => {  //on click...
    clearAnimalsAndMenu(); //clear the page

    if (currentPage === pages[0]) { //checks status of current page
      currentPage = pages[1]; //on click, declares new current page
      loadPage(pages[1]); //loads page with json path using .ajax below
    } else {
      currentPage = pages[0]; //else same for other page
      loadPage(pages[0]);
    }
  })



  function loadPage(jsonPath) {
    $.ajax(jsonPath, { method: 'GET', dataType: 'JSON' })
      .then((data) => {
        const menuOptions = []

        //for each animal, create a menu item, and an animal OBJECT.
        data.forEach((animal) => {
          const unit = new PrintImg(animal);
          if (!menuOptions.includes(unit.keyword)) { menuOptions.push(unit.keyword) }
        })

        //select all <option>s, and when they are clicked, return its text.

        createFilterMenu(menuOptions);
        createSortMenu();
        renderAnimals(data, 'default');

        //on change of #filter, send data and filter param to render function.
        $('#filter').on('change', function () {
          clearAnimals();
          renderAnimals(data, $(this).val());
        })

        //sort the data and render.
        $('#sort-by').on('change', function () {
          if ($(this).val() === 'Number of Horns') {
            data.sort((a, b) => a.horns - b.horns);
          } else if ($(this).val() === 'Title') {
            data.sort((a, b) => a.title < b.title ? -1 : 1);
          }
          clearAnimals();
          //render animals using current filter param
          renderAnimals(data, $('#filter').val());
        })
      })
  }

  loadPage(pages[0]);
})
