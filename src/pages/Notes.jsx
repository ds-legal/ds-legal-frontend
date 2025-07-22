import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function Notes() {
    return (
        <>
        <div className="px-8 py-4">
            <div className="flex justify-between lg:flex-row flex-col gap-4">
                <div>
                    <h4 className="text-[24px] font-[600] text-[#000000]">Notes</h4>
                    <h4 className="text-[16px] font-[500] text-[#475367]">
                        Manage all your notes and keep track of important information
                    </h4>
                </div>
                <Link to="/createNote" className="flex gap-2 bg-[#1983D5] rounded-[40px] text-white lg:px-6 lg:py-1 py-3 px-4 items-center w-[40%] lg:w-auto ">
                    <span className="text-[12px]">Add a note</span>
                    <span className="text-[12px]"><FaPlus /></span>
                </Link>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-lg font-medium text-gray-600 mb-4">Notes functionality coming soon!</p>
                <p className="text-sm text-gray-500">This feature will allow you to create, edit, and organize your notes.</p>
            </div>
        </div>
        </>
    );
}

export default Notes;
