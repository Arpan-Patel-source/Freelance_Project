import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import api from '../../lib/api';
import {
    FileText,
    Search,
    RefreshCw,
    ArrowLeft,
    DollarSign,
    Calendar,
    User,
    Users
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import ScrollReveal from '../../components/ScrollReveal';
import { useNavigate } from 'react-router-dom';

export default function AdminContracts() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/contracts');
            setContracts(response.data);
        } catch (error) {
            console.error('Failed to fetch contracts:', error);
            console.error('Error details:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch = contract.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.freelancer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'completed':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'disputed':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-white">Loading contracts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="mb-8">
                        <div className="glass-dark rounded-3xl p-8 shadow-xl border-2 border-red-900/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/admin/dashboard')}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <h1 className="text-4xl font-bold text-white">Contracts Management</h1>
                                        </div>
                                        <p className="text-gray-300 ml-14">
                                            View all contracts on the platform ({filteredContracts.length} total)
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchContracts}
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Filters */}
                <Card className="mb-6 border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contracts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="disputed">Disputed</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Contracts List */}
                <Card className="border-2 border-red-900/50 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-red-900/50">
                        <CardTitle className="text-white">All Contracts</CardTitle>
                        <CardDescription className="text-gray-400">
                            Complete list of contracts on the platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {filteredContracts.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No contracts found</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredContracts.map((contract, index) => (
                                    <ScrollReveal key={contract._id} delay={index * 30}>
                                        <div className="p-5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-slate-600/50">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-xl font-semibold text-white">
                                                            {contract.job?.title || 'Untitled Job'}
                                                        </h3>
                                                        <Badge className={getStatusColor(contract.status)}>
                                                            {contract.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <User className="h-4 w-4 text-blue-400" />
                                                            <div>
                                                                <span className="text-gray-400">Client: </span>
                                                                <span className="text-white font-medium">
                                                                    {contract.client?.name || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Users className="h-4 w-4 text-green-400" />
                                                            <div>
                                                                <span className="text-gray-400">Freelancer: </span>
                                                                <span className="text-white font-medium">
                                                                    {contract.freelancer?.name || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm">
                                                            <DollarSign className="h-4 w-4 text-yellow-400" />
                                                            <div>
                                                                <span className="text-gray-400">Amount: </span>
                                                                <span className="text-white font-semibold">
                                                                    {formatCurrency(contract.totalAmount)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 text-purple-400" />
                                                            <div>
                                                                <span className="text-gray-400">Created: </span>
                                                                <span className="text-white">
                                                                    {formatDateTime(contract.createdAt).split(' at ')[0]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {contract.status === 'completed' && contract.completedAt && (
                                                        <div className="flex items-center gap-2 text-sm mt-2">
                                                            <Calendar className="h-4 w-4 text-green-400" />
                                                            <span className="text-gray-400">Completed on: </span>
                                                            <span className="text-green-300">
                                                                {formatDateTime(contract.completedAt)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {contract.platformFee && (
                                                        <div className="mt-3 pt-3 border-t border-slate-600">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-400">Platform Fee ({contract.platformFeePercentage || 10}%)</span>
                                                                <span className="text-red-300 font-semibold">
                                                                    {formatCurrency(contract.platformFee)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
