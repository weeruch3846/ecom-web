import React, { useState, useEffect } from "react";
import { getListAllUsers } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { changeUserStatus, changeUserRole } from "../../api/admin";
import { toast } from "react-toastify";

const TableUsers = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // code body
    handleGetUsers(token);
  }, []);

  const handleGetUsers = (token) => {
    getListAllUsers(token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserStatus = (userId, userStatus) => {
    console.log(userId, userStatus);
    const value = {
      id: userId,
      enabled: !userStatus,
    };
    changeUserStatus(token, value)
      .then((res) => {
        console.log(res);
        handleGetUsers(token);
        toast.success("Update Status Success!!");
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, userRole) => {
    // console.log(userId, userStatus);
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then((res) => {
        console.log(res);
        handleGetUsers(token);
        toast.success("Update Role Success!!");
      })
      .catch((err) => console.log(err));
  };

  console.log(users);
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              จัดการผู้ใช้งาน
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              ทั้งหมด {users?.length ?? 0} บัญชี
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                <th className="px-6 py-3 font-medium">ลำดับ</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">สิทธิ์</th>
                <th className="px-6 py-3 font-medium">สถานะ</th>
                <th className="px-6 py-3 font-medium text-right">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users?.map((el, i) => (
                <tr
                  key={el.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-6 py-3 text-slate-700 font-medium">
                    {el.email}
                  </td>

                  <td className="px-6 py-3">
                    <select
                      onChange={(e) =>
                        handleChangeUserRole(el.id, e.target.value)
                      }
                      value={el.role}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm text-slate-700
                      bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                      cursor-pointer"
                    >
                      <option>user</option>
                      <option>admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${
                        el.enabled
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          el.enabled ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {el.enabled ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm
                      transition-colors ${
                        el.enabled
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-indigo-500 hover:bg-indigo-600"
                      }`}
                      onClick={() => handleChangeUserStatus(el.id, el.enabled)}
                    >
                      {el.enabled ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}

              {users?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-400 text-sm"
                  >
                    ไม่พบข้อมูลผู้ใช้งาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableUsers;
