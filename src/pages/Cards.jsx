import React, { useState } from 'react';
import { Plus, CreditCard as CardIcon, Smartphone } from 'lucide-react';
import AccountCard from '../components/sections/cards/AccountCard';
import AddAccountModal from '../components/sections/cards/AddAccountModal';

const Cards = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Mock connected accounts
    const [accounts, setAccounts] = useState([
        {
            id: 1,
            type: 'card',
            cardType: 'Credit',
            bankName: 'HDFC Bank',
            name: 'Sai Pavan',
            number: '4321 •••• •••• 8721',
            expiry: '12/28',
            gradient: 'from-blue-600 to-indigo-800'
        },
        {
            id: 2,
            type: 'upi',
            provider: 'Google Pay',
            upiId: 'sai@oksbi',
            gradient: 'from-emerald-600 to-teal-800'
        }
    ]);

    return (
        <div className="p-8 h-full flex flex-col pt-6 font-manrope">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Cards & UPI</h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage your connected financial accounts.</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all outline-none"
                >
                    <Plus className="w-4 h-4" />
                    Add Account
                </button>
            </div>

            {/* Content: Account Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map(acc => (
                    <AccountCard key={acc.id} account={acc} />
                ))}
            </div>

            {/* Add Account Modal */}
            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={(newAcc) => {
                    setAccounts([...accounts, { ...newAcc, id: Date.now() }]);
                    setIsAddModalOpen(false);
                }}
            />
        </div>
    );
};

export default Cards;
