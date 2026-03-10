import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTables, deleteTable } from "../tableSlice";
import TableCard from "../components/TableCard";
import CreateTableModal from "../components/CreateTableModal";

export default function TablesScreen() {

  const dispatch = useDispatch();
  const { tables, loading } = useSelector(s => s.tables);
  const { user } = useSelector(state => state.auth);


  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);


  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  const handleEdit = (table) => {
  setEditData(table);
  setOpen(true);
};


  const remove = (id) => {
    if (window.confirm("Delete table?")) {
      dispatch(deleteTable(id));
    }
  };

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Tables Layout
        </h1>

{user?.role === "franchise" && (
  <button
    onClick={() => {
      setEditData(null);
      setOpen(true);
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    + Add Table
  </button>
)}

      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
        ">
          {tables.map(table => (
            <TableCard
              key={table._id}
              table={table}
              onDelete={remove}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* <CreateTableModal open={open} setOpen={setOpen} editData={editData} /> */}
      <CreateTableModal
  open={open}
  setOpen={(val) => {
    setOpen(val);
    if (!val) setEditData(null); // auto reset
  }}
  editData={editData}
/>
    </div>
  );
}
