'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ModalContainer, configureStore, Interface} from 'combine-modals';

const store = configureStore();
const modalsRoot = document.createElement("div");
modalsRoot.className = 'modals';
document.body.appendChild(modalsRoot);

document.addEventListener("DOMContentLoaded", () => {
  const helpStructure = window.HS;
  ReactDOM.render(
    <Provider store={store}>
      <ModalContainer helpStructure={helpStructure}/>
    </Provider>,
    modalsRoot
  );
});

module.exports = Interface(store);