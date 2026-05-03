import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, users }) {
    const deleteUser = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Gestion des Utilisateurs</h2>}
        >
            <Head title="Admin - Utilisateurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-lg font-bold">Liste des membres</h3>
                            <Link href={route('admin.users.create')} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-sm font-bold">
                                Ajouter un utilisateur
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Nom</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Rôle</th>
                                        <th className="px-6 py-3">Statut</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map(user => (
                                        <tr key={user.id} className="border-b dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {user.is_admin ? (
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded">Admin</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded">Étudiant</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.is_banned ? (
                                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded">Banni</span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">Actif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link href={route('admin.users.edit', user.id)} className="text-blue-500 hover:underline font-bold">Modifier</Link>
                                                <button onClick={() => deleteUser(user.id)} className="text-red-500 hover:underline font-bold">Supprimer</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination links could go here */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
