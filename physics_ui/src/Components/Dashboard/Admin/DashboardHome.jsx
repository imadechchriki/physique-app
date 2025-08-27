import React from "react";
import {
  Activity,
  ChevronRight,
  Target,
  Zap,
} from "lucide-react";
import DashboardLayout from '../../shared/DashboardLayout';

const DashboardHome = () => {
  const statsData = [
    { title: "Students", value: "342", change: "+18%", color: "blue" },
    { title: "Courses", value: "18", change: "+12%", color: "emerald" },
    { title: "Completion", value: "94%", change: "+5%", color: "purple" },
    { title: "Performance", value: "89%", change: "+8%", color: "orange" },
  ];

  const recentActivity = [
    {
      title: "Quantum Physics Exam",
      time: "2h ago",
      status: "completed",
      students: 42,
    },
    {
      title: "Thermodynamics Lab",
      time: "4h ago",
      status: "active",
      students: 28,
    },
    { title: "Mechanics Quiz", time: "1d ago", status: "graded", students: 35 },
  ];

  const StatCard = ({ title, value, change, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            color === "blue"
              ? "text-blue-600 bg-blue-50"
              : color === "emerald"
              ? "text-emerald-600 bg-emerald-50"
              : color === "purple"
              ? "text-purple-600 bg-purple-50"
              : "text-orange-600 bg-orange-50"
          }`}
        >
          {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          activity.status === "completed"
            ? "bg-emerald-100 text-emerald-600"
            : activity.status === "active"
            ? "bg-blue-100 text-blue-600"
            : "bg-purple-100 text-purple-600"
        }`}
      >
        <Activity className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{activity.title}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{activity.students} students</span>
          <span>•</span>
          <span>{activity.time}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );

  return (
    <DashboardLayout
      currentPage="home"
      pageTitle="Tableau de bord"
      pageSubtitle="Vue d'ensemble de votre plateforme éducative"
      userName="PR"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Student Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Répartition des Étudiants
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              Voir tout
            </button>
          </div>

          <div className="space-y-6">
            {[
              {
                name: "Physique Mathématique",
                students: 128,
                percentage: 37,
                color: "blue",
              },
              {
                name: "Physique Expérimentale",
                students: 142,
                percentage: 42,
                color: "emerald",
              },
              {
                name: "Physique Théorique",
                students: 72,
                percentage: 21,
                color: "purple",
              },
            ].map((field, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    field.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : field.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <span className="font-bold text-sm">
                    {field.name.split(" ")[0][0]}
                    {field.name.split(" ")[1][0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {field.name}
                    </h4>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {field.students}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {field.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        field.color === "blue"
                          ? "bg-blue-500"
                          : field.color === "emerald"
                          ? "bg-emerald-500"
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${field.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Activité Récente
            </h3>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-1">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium text-center hover:bg-blue-50 rounded-lg transition-colors">
            Voir toute l'activité
          </button>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">94%</span>
          </div>
          <h4 className="font-semibold mb-1">Completion des Cours</h4>
          <p className="text-blue-100 text-sm">
            Moyenne sur tous les cours
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">87%</span>
          </div>
          <h4 className="font-semibold mb-1">Engagement Étudiant</h4>
          <p className="text-emerald-100 text-sm">
            Taux de participation active
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;