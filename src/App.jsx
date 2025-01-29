import toast from 'react-hot-toast';
import './App.css'

const notify = () => toast.success('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
    </div>
  );
};

export default App
