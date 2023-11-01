// Code for the map to work
function initMap() {
    navigator.geolocation.getCurrentPosition(position => {
      // Set map to be center on location of the user w/ 13 zoom
      const { latitude, longitude } = position.coords;
      console.log(latitude);
      console.log(longitude);

      let mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 13
      }

      let map = new google.maps.Map(document.getElementById('map'), mapOptions);

      // Go through inputted data and display the markers & initialize other data
      for (let i = 0; i < localStorage.length; i++) {
        const markerKey = localStorage.key(i);
        if (markerKey.startsWith(`marker_`)) {
          const data = JSON.parse(localStorage.getItem(markerKey));
          const [, lat, lng] = markerKey.split('_');
          const location = new google.maps.LatLng(Number(data.lat), Number(data.lng));
          console.log(location);
          displayMarker(location, map, data);
        }
      }

      // Place marker when map clicked
      google.maps.event.addListener(map, 'click', function (event) {
        placeMarker(event.latLng, map);
      });

      // Open marker's infowindow when marker clicked
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });

      // Function to display the marker on the screen (when the markers are being added to the screen) and to add the data from localStorage to the marker's infowindow
      function displayMarker(location, map, data) {
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          icon: { url: "/toiletmarker.png", scaledSize: new google.maps.Size(50, 50) }
        });

        var form = document.createElement('form');
        var infowindow = new google.maps.InfoWindow({
          content: form
        });
        function addNewLine() {
          var line = document.createElement('div');
          form.appendChild(line);
          return line;
        }


        const nameLabel = document.createElement('label');
        nameLabel.textContent = `Name: ${data.name}`;
        form.appendChild(nameLabel);
        addNewLine();

        const ratingLabel = document.createElement('label');
        ratingLabel.textContent = `Cleanliness Rating: ${data.rating}`;
        form.appendChild(ratingLabel);
        addNewLine();

        const diaperLabel = document.createElement('label');
        diaperLabel.textContent = `Diaper Changing Station: ${data.hasDiaper ? 'Yes' : 'No'}`;
        form.appendChild(diaperLabel);
        addNewLine();

        const directionsLink = document.createElement('a');
        directionsLink.textContent = 'Directions';
        directionsLink.href = `https://maps.google.com/?q=${data.lat},${data.lng}`;
        directionsLink.style.color = 'blue';
        form.appendChild(directionsLink);
        addNewLine();

        const commentsLabel = document.createElement('label');
        commentsLabel.textContent = `Additional Comments: ${data.comments}`;
        form.appendChild(commentsLabel);
        addNewLine();


        var newComments = document.createElement('label');
        newComments.textContent = 'Add Comment:';
        var commentsInput = document.createElement('textarea');
        newComments.appendChild(commentsInput);
        form.appendChild(newComments);
        var nameLine = addNewLine();

        var submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = 'Submit';
        form.appendChild(submitButton);

        submitButton.addEventListener('click', function () {
          var commentText = commentsInput.value;
          if (commentText) {
            data.comments = data.comments + '<br>' + commentsInput.value;
            commentsLabel.innerHTML = `Additional Comments: ${data.comments}`;
            addNewLine();

            commentsInput.value = '';
          }
        });

        var nameLine = addNewLine();
        const imageLabel = document.createElement('label');
        imageLabel.textContent = `Image:`;
        form.appendChild(imageLabel);

        const image1 = document.createElement('img');
        console.log(data.image);
        image1.src = data.image;
        image1.style.maxWidth = '200px';
        image1.style.maxHeight = '200px';
        form.appendChild(image1);
        addNewLine();
        console.log(data.image);
        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });




      }

      // Function to place a new marker; adds the marker and puts it in localStorage
      function placeMarker(location, map) {
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          icon: { url: "/toiletmarker.png", scaledSize: new google.maps.Size(50, 50) }
        });

        var form = document.createElement('form');

        function addNewLine() {
          var line = document.createElement('div');
          form.appendChild(line);
          return line;
        }

        var title = document.createElement('h2');
        title.textContent = 'Bathroom Information';
        form.appendChild(title);

        var nameLabel = document.createElement('label');
        nameLabel.textContent = 'Name:';
        var nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameLabel.appendChild(nameInput);
        form.appendChild(nameLabel);
        var nameLine = addNewLine();

        var ratingLabel = document.createElement('label');
        ratingLabel.textContent = 'Cleanliness Rating (0-5):';
        var ratingInput = document.createElement('input');
        ratingInput.setAttribute('type', 'number');
        ratingInput.setAttribute('min', '0');
        ratingInput.setAttribute('max', '5');
        ratingLabel.appendChild(ratingInput);
        form.appendChild(ratingLabel);
        var nameLine = addNewLine();


        var diaperLabel = document.createElement('label');
        diaperLabel.textContent = 'Has Diaper Changing Station:';
        var diaperInput = document.createElement('input');
        diaperInput.setAttribute('type', 'checkbox');
        diaperLabel.appendChild(diaperInput);
        form.appendChild(diaperLabel);
        var nameLine = addNewLine();


        var imageLabel = document.createElement('label');
        imageLabel.textContent = 'Image Upload:';
        var imageInput = document.createElement('input');
        imageInput.setAttribute('type', 'file');
        imageLabel.appendChild(imageInput);
        form.appendChild(imageLabel);
        var nameLine = addNewLine();


        var commentsLabel = document.createElement('label');
        commentsLabel.textContent = 'Additional Comments:';
        var commentsInput = document.createElement('textarea');
        commentsLabel.appendChild(commentsInput);
        form.appendChild(commentsLabel);
        var nameLine = addNewLine();
        var nameLine = addNewLine();


        var submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        form.appendChild(submitButton);
        var nameLine = addNewLine();


        var infowindow = new google.maps.InfoWindow({
          content: form
        });

        marker.addListener('click', function () {
          infowindow.open(map, marker);
        });
        infowindow.open(map, marker);

        submitButton.addEventListener('click', handleFormSubmission(location, map, infowindow, marker));
        function handleFormSubmission(location, map, infowindow, marker) {
          return function () {
            const markerKey = `marker_${location.lat()}_${location.lng}`;
            newData = {
              name: nameInput.value,
              rating: ratingInput.value,
              hasDiaper: diaperInput.checked,
              image: '',
              comments: commentsInput.value,
              lat: location.lat(),
              lng: location.lng()
            };

            while (form.firstChild) {
              form.removeChild(form.firstChild);
            }

            const updatedNameLabel = document.createElement('label');
            updatedNameLabel.textContent = `Name: ${newData.name}`;
            form.appendChild(updatedNameLabel);
            var newLine = addNewLine();

            const updatedRatingLabel = document.createElement('label');
            updatedRatingLabel.textContent = `Cleanliness Rating: ${newData.rating}`;
            form.appendChild(updatedRatingLabel);
            var newLine = addNewLine();

            const updatedDiaperLabel = document.createElement('label');
            updatedDiaperLabel.textContent = `Diaper Changing Station: ${newData.hasDiaper ? 'Yes' : 'No'}`;
            form.appendChild(updatedDiaperLabel);
            var newLine = addNewLine();


            var updatedCommentsLabel = document.createElement('label');
            updatedCommentsLabel.textContent = `Additional Comments: ${newData.comments}`;
            form.appendChild(updatedCommentsLabel);
            var newLine = addNewLine();

            var newComments = document.createElement('label');
            newComments.textContent = `Add Comment:`;
            var commentsInput1 = document.createElement('textarea');
            newComments.appendChild(commentsInput1);
            form.appendChild(newComments);
            var nameLine = addNewLine();

            var submitButton1 = document.createElement('button');
            submitButton1.type = 'button';
            submitButton1.textContent = `Submit`;
            form.appendChild(submitButton1);

            submitButton1.addEventListener('click', function () {
              var commentText = commentsInput1.value;
              if (commentText) {
                newData.comments = newData.comments + '<br>' + commentsInput1.value;
                updatedCommentsLabel.innerHTML = `Additional Comments: ${newData.comments}`;
                addNewLine();

                commentsInput.value = '';
              }
            });
            addNewLine();
            const directionsLink = document.createElement('a');
            directionsLink.textContent = 'Directions';
            const markerLat = marker.getPosition().lat();
            const markerLng = marker.getPosition().lng();
            directionsLink.href = `https://maps.google.com/?q=${markerLat},${markerLng}`;
            directionsLink.style.color = 'blue';
            form.appendChild(directionsLink);
            var newLine = addNewLine();



            const updatedImageLabel = document.createElement('label');
            updatedImageLabel.textContent = `Image:`;
            form.appendChild(updatedImageLabel);
            function handleImageData(image) {
              newData.image = image;
              console.log(newData.image);
            }

            function loadImageData(file) {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function (event) {
                  const imageData = event.target.result;
                  handleImageData(imageData);
                  resolve(imageData);
                };

                reader.onerror = function (error) {
                  reject(error);
                };

                reader.readAsDataURL(file);
              });
            }

            const file = imageInput.files[0];

            loadImageData(file)
              .then((imageData) => {
                console.log(newData.image);

                const updatedImage = document.createElement('img');
                updatedImage.src = imageData;
                updatedImage.style.maxWidth = '200px';
                updatedImage.style.maxHeight = '200px';
                form.appendChild(updatedImage);

                localStorage.setItem(markerKey, JSON.stringify(newData));
                infowindow.close();
                infowindow.open(map, marker);
              })
              .catch((error) => {
                console.error("Error loading image data:", error);
              });

            localStorage.setItem(markerKey, JSON.stringify(newData));

            infowindow.close();
            infowindow.open(map, marker);


          };
        }


      }
    });

  }