var dogRepository = (function() {
    /*object array placed inside IIFE*/
    'use strict';
    var newdogRepository = [

    ];
    /* Replaced Fetch With Ajax*/

    $.ajax({
        type: 'GET',
        url: 'https://dog.ceo/api/breeds/list/all',
        success: function(json) {
            $.each(json.message, function(item) {
                dogRepository.add(item)
                dogRepository.addListItem(item);
            });
        },
        error: function(err) {
            console.log(err);
        }
    })

    return {
        getAll: function() {
            return newdogRepository;
        },
        add: function(breed) {

            newdogRepository.push({
                breed: breed
            });
        },
        addListItem: function(breed) {
            var listItem = `<li><button class="dog-button ${breed}">${breed[0].toUpperCase() + breed.slice(1)}</button></li>`

            // create the list item and add it to the DOM
            dogListElement.append(listItem);
            $(`.${breed}`).on('click', function() {
                dogRepository.showDetails(breed)
            })

        },
        showDetails: async function(breed) {

            $.ajax({
                type: 'GET',
                url: `https://dog.ceo/api/breed/${breed}/images/random`,
                success: function(imageJSON) {
                    $.ajax({
                        type: 'GET',
                        url: `https://dog.ceo/api/breed/${breed}/list`,
                        success: function(subBreedJSON) {
                            createReusableModal()
                            showModal({
                                imageURL: imageJSON.message,
                                subBreeds: subBreedJSON.message
                            })
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    })

                },
                error: function(err) {
                    console.log(err);
                }
            })
        }

    };


})();

var $modalContainer = $('#modal-container');

function createReusableModal() {

    var modal = $('<div class="modal"></div>');
    var modalElement2 = $('<div class="dog-info"> </div>');


    var closeButtonElement = $('<button class="modal-close"> Close </button>');
    closeButtonElement.on('click', hideModal)
    var titleElement = $('<h3>Sub-breeds</h3>');

    var imageElement = $('<img class="dog-img">');

    var subBreedElement = $('<ul class="subbreeds"> </ul>');

    modal.append(closeButtonElement);
    modalElement2.append(imageElement);
    modalElement2.append(titleElement);
    modalElement2.append(subBreedElement);
    modal.append(modalElement2)
    $modalContainer.append(modal);
}

//Function to show modal for dog data
function showModal(item) {
    //create element for dog name
    var subBreedElement = $('.subbreeds');
    var imageElement = $('.dog-img');
    imageElement.attr('src', item.imageURL);
    if (item.subBreeds.length === 0) {
        var Element = $('<p>No sub-breeds</p>');
        subBreedElement.append(Element)
    } else {
        for (var i = 0; i < item.subBreeds.length; i++) {
            var element = $(`<li>${item.subBreeds[i]}</li>`);
            subBreedElement.append(element)

        }
    }
    $modalContainer.addClass('is-visible');
}
//Function to hide modal
function hideModal() {
    //var $modalContainer = document.querySelector('#modal-container');
    $modalContainer.removeClass('is-visible');
    $modalContainer.text('');
}
//Function to show details of each dog
function showDetails(item) {
    dogRepository.loadDetails(item).then(function() {
        return item;
    }).then(function(item) {
        showModal(item);
    });
}
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
        hideModal();
    }
});
$('#modal-container').on('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal
    // We only want to close if the user clicks directly on the overlay
    var target = e.target;
    var $modalClose = $('.modal-close');
    if (target === $modalContainer || $modalClose) {
        hideModal();
    }
})

// getting the dog list element from index.html
var dogListElement = $('.dog-list');

// get all the dogs for looping over
var dogs = dogRepository.getAll();