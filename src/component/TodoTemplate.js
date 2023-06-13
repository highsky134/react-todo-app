import React, { useEffect, useState } from 'react'
import TodoHeader from './TodoHeader'
import TodoMain from './TodoMain'
import TodoInput from './TodoInput'
import { API_BASE_URL as BASE, TODO} from '../config/host-config'
import { useNavigate } from 'react-router-dom'
import { getLoginUserInfo } from '../util/login-util'
import { Spinner } from 'reactstrap'

import './scss/TodoTemplate.scss';

const TodoTemplate = () => {

  // 로딩 상태값 관리
  const [loading, setLoading] = useState(true);

  const redirection = useNavigate();

  // 로그인 인증토큰 얻어오기
  const token = getLoginUserInfo().token;

  // 요청 헤더 설정
  const requestHeader = {
    'content-type' : 'application/json',
    'Authorization' : 'Bearer ' + token
  }

  // 서버에 할일 목록(json)을 요청해서 받아와야 함
  const API_BASE_URL = BASE + TODO;

  const [todos, setTodos] = useState([]);

  // id값 시퀀스 생성 함수
  const makeNewId = () => {    
    return (todos.length === 0) ? 1 : todos[todos.length - 1].id + 1;
  };

  // TodoInput에게 todoText를 받아오는 함수
  const addTodo = todoText => {
    // console.log('할일 정보 in TodoTemplate:' + todoText);

    const newTodo = {
      id: makeNewId(),
      title: todoText,
      done: false
    };

    // todos.push(newTodo);

    // 리액트의 상태변수는 무조건 setter를 통해서만 
    // 상태값을 변경해야 렌더링에 적용된다.
    // 다만 상태변수가 불변성(immutable)을 가지기 때문에
    // 기존의 상태에서 변경이 불가능하고 
    // 새로운 상태를 만들어서 변경해야 한다.
    // const copyTodos = todos.slice();
    // copyTodos.push(newTodo);

    fetch(API_BASE_URL, {
      method:'POST',
      headers: requestHeader,
      body: JSON.stringify(newTodo)
    })
      .then(res => res.json())
      .then(json => {
        setTodos(json.todos);
      });

    
    setTodos([...todos, newTodo]);

  };


  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {

    fetch(API_BASE_URL, {
      method: 'PUT',
      headers: requestHeader,
      body: JSON.stringify({
         done: !done,
         id: id
      })
    })
    .then(res => res.json())
    .then(json => setTodos(json.todos)); 


    // console.log(`체크 대상 id:${id}`);

    // setTodos(todos.map(todo => todo.id === id ? {...todo, done: !todo.done} : todo));

  };


  // 할 일 삭제 처리 함수
  const removeTodo = id => {
    // console.log(`삭제 대상 id:${id}`);    
    setTodos(todos.filter(todo => todo.id !== id));   
    
    fetch(`${API_BASE_URL}/${id}`, {
      method:'DELETE',
      headers: requestHeader
    })
      .then(res => res.json())
      .then(json => {
        setTodos(json.todos);
      })
  };

  // 체크가 안된 할 일의 개수 카운트하기
  const countRestTodo = () => todos.filter(todo => !todo.done).length;


  // useEffect : 화면이 렌더링 된 이후에 실행되는 함수
  useEffect(() => {
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader
    })
      .then(res => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) {
          alert('로그인이 필요한 서비스입니다.');
          redirection('/login');
          return;
        } else {
          alert('서버가 불안정합니다.');
        }
      })
      .then(json => {
        // console.log(json.todos);
        setTodos(json.todos);

        // 로딩 완료 처리
        setLoading(false);
      });
  },[]);

  // 로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain 
        todoList={todos} 
        remove={removeTodo} 
        check={checkTodo}
      />
      <TodoInput add={addTodo} />
    </div>
  );

  // 로딩 중일때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>
        loading...
      </Spinner>
    </div>
  );
  
  return (
    <>
      { loading ? loadingPage : loadEndedPage}
    </>    
  )
}

export default TodoTemplate