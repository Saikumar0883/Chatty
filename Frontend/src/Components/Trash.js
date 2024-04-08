import React, { useEffect } from 'react'

function Trash() {

  useEffect(() => {
    console.log("hello");
  }, [])

  return (
    <div>Trash</div>
  )
}

export default Trash
