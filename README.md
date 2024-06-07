# voluntoldyou-cs278

This repository contains code that was used to implement a personalized recommendation algorithm on 
[VolunTold You](https://ayeshakhawaja01.wixsite.com/voluntold-you), a social volunteer-sharing platform developed as a final project for CS 278: Social Computing at Stanford University.

This code was written using Velo by Wix. `wix.js` contains the bulk of the code; it calls a backend function implemented in `contacts.web.js`, because Wix required that backend-specific functions be implemented in separate web.js files. `volunteer.js` has preliminary code that we wrote for the project milestone, which was eventually modified and integrated formally into Velo in `wix.js`.

To deploy this code, we turned on Wix's `Dev Mode` and added this code into the Dev Mode files associated with the Home page. See the screenshot below to see where we wrote the code. On the left sidebar, you can also see where the `contacts.web.js` file can be accessed.

<img width="1503" alt="Screenshot 2024-06-07 at 2 32 56 AM" src="https://github.com/ayeshakhawaja/voluntoldyou-cs278/assets/103908785/f1adb10b-4fd2-49ae-92cd-346be2cd49bc">
