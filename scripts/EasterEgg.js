
document.getElementById('easterImage').click();
easter = false;
var image = document.getElementById('easterImage');
var width = window.innerWidth;
var height = window.innerHeight;
image.style.width = width * 0.14 + 'px';
image.style.height = 0.41 * parseFloat(image.style.width) + 'px';
image.style.top = (height - parseFloat(image.style.height)) * .95 + 'px';
image.style.left = (width - parseFloat(image.style.width)) * .95 + 'px';
xEgg = Math.floor(Math.random() * width);
yEgg = Math.floor(Math.random() * height);
// console.log(width,height);
// console.log(xEgg,yEgg);
window.addEventListener('resize', handleResize);
function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    var xEgg = Math.floor(Math.random() * width);
    var yEgg = Math.floor(Math.random() * height);
    // console.log(width,height);
    // console.log(xEgg,yEgg);
    image.style.width = width * 0.14 + 'px';
    image.style.height = 0.41 * parseFloat(image.style.width) + 'px';
    image.style.top = (height - parseFloat(image.style.height)) * .95 + 'px';
    image.style.left = (width - parseFloat(image.style.width)) * .95 + 'px';
    // console.log(width,height);
}

document.addEventListener('mousemove', function (event) {
    var pixel = { x: xEgg, y: yEgg };
    var pixelData = document.elementFromPoint(pixel.x, pixel.y);
    // console.log(event.clientX,event.clientY);
    if (pixel.x - 10 <= event.clientX && event.clientX <= pixel.x + 10 && pixel.y - 10 <= event.clientY && event.clientY <= pixel.y + 10 && easter == false) {
        console.log('easterEgg en cours');
        easter = true;
        var audioEasterEgg = document.getElementById('audioEasterEgg');
        audioEasterEgg.play();
        image.classList.remove('d-none');

        // Récupérer les dimensions de l'image
        var imageWidth = image.offsetWidth;
        var imageHeight = image.offsetHeight;

        // Calculer la position du centre de l'image
        var imageLeft = image.offsetLeft;
        var imageTop = image.offsetTop;
        var imageCenterX = imageLeft + imageWidth / 2;
        var imageCenterY = imageTop + imageHeight / 2;

        setTimeout(function () {
            centreImage = { x: parseFloat(image.style.left) + parseFloat(image.style.width) / 2, y: parseFloat(image.style.top) + parseFloat(image.style.height) / 2 }
            angleRad = Math.atan(centreImage.y / centreImage.x);

            image.style.transform += 'rotate(' + angleRad + 'rad)';
            // console.log(imageCenterX);
            // console.log(imageCenterY);
            // console.log(centreImage);
            setTimeout(function () {
                // Action 2 : Translation
                image.style.transform += ' translate(' + (-width * 1.2) + 'px, ' + (0) + 'px)';
                setTimeout(function () {
                    image.classList.add('d-none');
                }, 2500);
            }, 1500);
        }, 1500);
    }
});