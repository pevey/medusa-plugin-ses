import { useState, useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'

const CodeEditor = () => {
   const [value, setValue] = useState("console.log('hello world!')")

   const onChange = useCallback((val, viewUpdate) => {
     console.log('val:', val)
     setValue(val)
   }, [])

   return <CodeMirror value={value} height="auto" onChange={onChange} />
 }

 export default CodeEditor