// const element = (
//   <div className="test">
//     <span title="foo">Hello</span>
//     <a href="https://www.baidu.com">测试链接</a>
//   </div>
// );
// console.log('element: ', element);
import { useState } from 'react';
import ReactDom from 'react-dom';
import { createRoot } from 'react-dom/client';

// const element = (
//   <div className="test">
//     <Child />
//   </div>
// );
function App() {
  const [num, setNum] = useState(2);
  console.log('num: ', num);
  // window.setNum = setNum;
  // return <div>{num}</div>;
  // return num === 100 ? <Child onClick={() => setNum(100)} /> : <div>{num}</div>;
  // return <div onClick={() => setNum(num + 1)}>{num}</div>;
  const arr =
    num % 2 === 0
      ? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
      : [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

  // return <ul onClick={() => setNum(num + 1)}>{arr}</ul>;
  return (
    <ul
      onClick={() => {
        setNum(num + 1);
        setNum(num + 1);
        setNum(num + 1);
      }}
    >
      <li>4</li>
      <li>5</li>
      {arr}
    </ul>
  );
}

function Child() {
  return <div>Hello React 18 Child</div>;
}
createRoot(document.getElementById('root') as HTMLElement).render(<App />);
// console.log('React: ', createElement);
console.log('ReactDom: ', ReactDom);
// console.log('element: ', <App />);

