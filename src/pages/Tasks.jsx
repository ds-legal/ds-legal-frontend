import { FaPlus } from "react-icons/fa";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Filter from "../components/common/Filter";
import { useTask } from "../store/task.context";
import Task from "../components/Task";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

function Tasks() {
  const { getAllTask, task, loading } = useTask();
  const tasks = Array.isArray(task) ? task : [];

  useEffect(() => {
    getAllTask();
  }, []);

  return (
    <>
      <div className="px-8 py-4 overflow-x-hidden">
        <div className="flex justify-between lg:flex-row flex-col gap-4">
          <div>
            <h4 className="text-[24px] font-[600] text-[#000000]">Task board</h4>
            <h4 className="text-[16px] font-[500] text-[#475367]">
              Manage all your tasks and prioritize better
            </h4>
          </div>
          <Link to="/createTask" className="flex gap-2 bg-[#1983D5] rounded-[40px] text-white lg:px-6 lg:py-1 py-3 px-4 items-center w-[40%] lg:w-auto ">
            <span className="text-[12px]">Add a task</span>
            <span className="text-[12px]"><FaPlus /></span>
          </Link>
        </div>

        <Filter />

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
          {loading ? (
            Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="p-4 border border-gray-300 rounded shadow">
                <Skeleton height={20} width={`60%`} />
                <Skeleton height={15} className="mt-2" count={3} />
                <Skeleton height={30} width={`40%`} className="mt-3" />
              </div>
            ))
          ) : tasks.length === 0 ? (
            <div className="col-span-full text-center mt-8">
              <p className="text-lg font-medium text-gray-600 mb-4">You don't have any tasks yet.</p>
              <Link to="/createTask" className="inline-block bg-[#1983D5] text-white px-6 py-2 rounded-full hover:bg-[#106cb2] transition">
                Proceed to Creating Task
              </Link>
            </div>
          ) : (
            tasks.map((task, id) => (
              <Task task={task} index={id} key={task.id || id} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Tasks;
