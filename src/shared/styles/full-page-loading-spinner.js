import { useEffect } from 'react';
import PropTypes from 'prop-types';

const numberOfMessages = 3;

export function useSpinner() {
  showLoadingSpinner(true);
  useEffect(() => {
    showLoadingSpinner(false);
  });
}

export function showLoadingSpinner(showIt) {
  if (showIt) {
    document.body.classList.add('loading');
    showWaitingMessage();
  } else {
    document.body.classList.remove('loading');
    hideWaitingMessage();
  }
}

function showWaitingMessage() {
  const { classList } = document.body;
  classList.add('message');
  const whichMessage = randomNumber(1, numberOfMessages);
  classList.add(`message-${whichMessage}`);
}

function hideWaitingMessage() {
  const { classList } = document.body;
  classList.remove('message');
  for (let i = 1; i <= numberOfMessages; i++) {
    classList.remove(`message-${i}`);
  }
}

function randomNumber(startInclusive, stopInclusive) {
  return Math.floor(Math.random() * stopInclusive + startInclusive);
}
