import { motion } from 'framer-motion';

const DataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Uraian</th>
            <th className="p-3">Satuan</th>
            <th className="p-3">Tarif</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr 
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border-b"
            >
              <td className="p-3">{row.Uraian}</td>
              <td className="p-3">{row.Satuan}</td>
              <td className="p-3">{row.Tarif}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};