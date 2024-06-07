/************
.web.js file
************

Backend '.web.js' files contain functions that run on the server side and can be called from page code.
This exclusively backend code was included in a separate file in our Wix platform.

Learn more at https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/calling-backend-code-from-the-frontend

****/

import { Permissions, webMethod } from "wix-web-module";
import { contacts } from 'wix-crm-backend';

export const getUser = webMethod(Permissions.Anyone, (contactId) => {
  const options = {
    suppressAuth: true
  };

  return contacts.getContact(contactId, options)
    .then((contact) => {
      let strInterests = contact.info.extendedFields["custom.volunteer-interests"];
      const interests = strInterests.split(", ")
      return interests;
    })
    .catch((error) => {
      console.error(error);
    });
});
