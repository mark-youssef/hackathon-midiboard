import React from 'react'

const Note = ({ on, image, i, j }) => (
  <div className={`note ${on ? 'note--on' : ''} note--${j}`}>
    <img src={image} />
  </div>
)

export default Note
