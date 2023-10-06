import { useState, useCallback } from 'react'
import CodeMirror, { oneDark } from '@uiw/react-codemirror'

const CodeEditor = ({ initialValue: string }) => {
   const [value, setValue] = useState("console.log('hello world!')")

   const onChange = useCallback((val, viewUpdate) => {
     console.log('val:', val)
     setValue(val)
   }, [])

   return <CodeMirror value={value} height="auto" onChange={onChange} theme={oneDark} className="text-[1rem]" />
 }

 export default CodeEditor