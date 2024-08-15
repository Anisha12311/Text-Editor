'use client'
export let CAN_USE_DOM =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

  export let CAN_USE_WINDOW =
  typeof window !== 'undefined' 
