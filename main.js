const playsong = (e) => {
    getLiPosition(e)
    console.log("song1 clicked", e)
}

function getLiPosition(liElement) {
    let olElement = liElement.parentElement;
    let liElements = olElement.children;
    
    for (let i = 0; i < liElements.length; i++) {
      if (liElements[i] === liElement) {
        console.log(`Index: ${i}`);
        break;
      }
    }
  }