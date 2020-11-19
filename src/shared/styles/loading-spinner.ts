import { useEffect } from 'react';

const numberOfMessages = 3;

export function useSpinner() {
  showLoadingSpinner(true);
  useEffect(() => {
    showLoadingSpinner(false);
  });
}

export function showLoadingSpinner(showIt: boolean) {
  if (showIt) {
    document.body.classList.add('loading');
    showWaitingMessage();
  } else {
    document.body.classList.remove('loading');
    hideWaitingMessage();
  }
}

function showWaitingMessage() {
  const classList = document.body.classList;
  classList.add('message');
  const whichMessage = randomNumber(1, numberOfMessages);
  classList.add(`message-${whichMessage}`);
}

function hideWaitingMessage() {
  const classList = document.body.classList;
  classList.remove('message');
  for (let i = 1; i <= numberOfMessages; i++) {
    classList.remove(`message-${i}`);
  }
}

function randomNumber(startInclusive: number, stopInclusive: number) {
  return Math.floor(Math.random() * stopInclusive + startInclusive);
}
