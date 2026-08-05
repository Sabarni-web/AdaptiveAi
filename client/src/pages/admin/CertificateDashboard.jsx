import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { getAdminCertificates } from '../../services/certificateService';
import { Search, Download, Trash2, Award } from 'lucide-react';

export const CertificateDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({ totalCertificates: 0, todayCertificates: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async (searchTerm = '') => {
    setLoading(true);
    try {
      const data = await getAdminCertificates(searchTerm);
      if (data.success) {
        setCertificates(data.certificates);
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCertificates(search);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader 
        title="Certificate Management" 
        description="View and manage all generated certificates." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-secondary text-sm font-medium">Total Certificates</p>
              <h3 className="text-2xl font-bold text-primary">{stats.totalCertificates}</h3>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-secondary text-sm font-medium">Generated Today</p>
              <h3 className="text-2xl font-bold text-primary">{stats.todayCertificates}</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Exam..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-hair rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-mint"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Search
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hair text-secondary text-sm">
                <th className="pb-3 font-medium">Certificate ID</th>
                <th className="pb-3 font-medium">Student Name</th>
                <th className="pb-3 font-medium">Exam Name</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="py-4 text-center text-secondary">Loading...</td></tr>
              ) : certificates.length === 0 ? (
                <tr><td colSpan="6" className="py-4 text-center text-secondary">No certificates found</td></tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert._id} className="border-b border-hair/50 hover:bg-surface-2 transition-colors">
                    <td className="py-3 font-mono text-xs">{cert.certificateId}</td>
                    <td className="py-3 font-medium">{cert.studentName}</td>
                    <td className="py-3 text-secondary">{cert.examName}</td>
                    <td className="py-3 text-emerald-500 font-medium">{cert.percentage.toFixed(1)}%</td>
                    <td className="py-3 text-secondary">{new Date(cert.issuedDate).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => window.open(`http://localhost:5000/api/v1/certificates/download/${cert.certificateId}`, '_blank')}
                          className="p-2 text-secondary hover:text-indigo-500 transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.open(`/verify/${cert.certificateId}`, '_blank')}
                          className="p-2 text-secondary hover:text-emerald-500 transition-colors"
                          title="View Certificate"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
