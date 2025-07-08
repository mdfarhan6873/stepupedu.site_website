import React, { useEffect, useState } from 'react';

interface TeacherPayment {
  _id: string;
  teacherName: string;
  amount: number;
  date: string;
  [key: string]: any;
}

const TeacherPaymentsView = () => {
  const [payments, setPayments] = useState<TeacherPayment[]>([]);
  const [selected, setSelected] = useState<TeacherPayment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ teacherName: '', amount: '', date: '' });

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    const res = await fetch('/api/teacher-payment');
    const data = await res.json();
    setPayments(data);
  };

  const handleEdit = (payment: TeacherPayment) => {
    setSelected(payment);
    setForm({ teacherName: payment.teacherName, amount: payment.amount.toString(), date: payment.date });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this payment?')) return;
    await fetch('/api/teacher-payment', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchPayments();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch('/api/teacher-payment', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id, ...form, amount: Number(form.amount) }),
    });
    setShowModal(false);
    setSelected(null);
    fetchPayments();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teacher Payments</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Teacher Name</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td className="border px-2 py-1">{p.teacherName}</td>
              <td className="border px-2 py-1">{p.amount}</td>
              <td className="border px-2 py-1">{p.date}</td>
              <td className="border px-2 py-1">
                <button className="mr-2 text-blue-600" onClick={() => handleEdit(p)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">Edit Payment</h3>
            <form onSubmit={handleSubmit}>
              <input className="border p-1 mb-2 w-full" name="teacherName" value={form.teacherName} onChange={handleChange} placeholder="Teacher Name" required />
              <input className="border p-1 mb-2 w-full" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" type="number" required />
              <input className="border p-1 mb-2 w-full" name="date" value={form.date} onChange={handleChange} placeholder="Date" required />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPaymentsView;
