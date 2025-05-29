import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '../components/bottomMenu';
import FormationCard from '../components/formationCard';
import {Icons} from '../constants/Icons';
import {useRouter} from 'expo-router';
import api from "./api";


const dummyActivities = [
    {id: '1', text: 'jilali inscrit à 2 BAC SM BIOF Math T9achr', time: '12h'},
    {id: '2', text: 'jillali posé une question dans Math', time: '12h'},
];

const dummyProfInfo = {
    name: 'Prof',
    image: null,
    totalFormations: 3,
    totalStudents: 72,
    totalActivities: 12
};

export default function DashboardScreen() {
    const [formations, setFormations] = useState([]);
    const [coursesInfo, setCoursesInfo] = useState([]);
    const [activities, setActivities] = useState([]);
    const [profInfo, setProfInfo] = useState(null);
    const [stats, setStats] = useState({
        totalFormations: 0,
        totalStudents: 0,
    });
    const router = useRouter();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const profInfoString = await AsyncStorage.getItem("profInfo");
                let profData;
                if (profInfoString) {
                    profData = JSON.parse(profInfoString);
                    setProfInfo(profData);
                } else {
                    console.log(
                        "No professor info found in AsyncStorage, using dummy data"
                    );
                    profData = dummyProfInfo;
                    setProfInfo(profData);
                }

                try {
                    console.log("Professor ID:", profData.id);
                    const response = await api.get(`/api/professors/me/courses`);
                    let courseIds = response.data.slice(0, 5).map(course => course.id);

                    // Fetch detailed info for each course
                    const coursesData = await Promise.all(
                        courseIds.map(async (courseId) => {
                            try {
                                const courseResponse = await api.get(`/api/courses/${courseId}`);
                                return courseResponse.data;
                            } catch (error) {
                                console.error(`Error fetching details for course ${courseId}:`, error);
                                return null; // or handle the error as you prefer
                            }
                        })
                    );

                    // Filter out any null values if there were errors
                    const mappedCourses = coursesData.filter(course => course !== null)
                        .map(course => ({
                            courseId: course.courseInfo.id,
                            courseTitle: course.courseInfo.title,
                            creationDate: course.courseInfo.uploadDate,
                            numberOfEnrolledStudents: course.courseStatistics.numberOfEnrolledStudents
                        }));

                    console.log("formations: ",  mappedCourses);

                    setFormations(mappedCourses);
                } catch (error) {
                    console.error("Error fetching formations:", error);
                }

                try {
                    const response = await api.get("/api/professors/me/students");
                    setActivities(response.data);
                } catch (error) {
                    console.error("Error fetching activities:", error);
                    setActivities(dummyActivities);
                }

                try {
                    const [coursesCountResponse, studentsCountResponse] =
                        await Promise.all([
                            api.get("/api/professors/me/courses/count"),
                            api.get("/api/professors/me/students/count")
                        ]);

                    setStats({
                        totalFormations: coursesCountResponse.data,
                        totalStudents: studentsCountResponse.data,
                    });
                } catch (error) {
                    console.error("Error fetching stats:", error);
                    setStats({
                        totalFormations:
                            profData?.totalFormations || dummyProfInfo.totalFormations,
                        totalStudents:
                            profData?.totalStudents || dummyProfInfo.totalStudents,
                    });
                }
            } catch (error) {
                console.error("Unexpected error during data fetching:", error);
            }
        };

        fetchAllData();
    }, []);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const options = {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            };
            return date.toLocaleDateString("fr-FR", options);
        } catch (error) {
            return dateString;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content"/>
            <ScrollView>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcome}>Welcome back!</Text>
                        <Text style={styles.name}>
                            Professeur {profInfo?.lastName || ""}
                        </Text>
                    </View>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity style={styles.notifCont}>
                            <Image source={Icons.notif} style={styles.notifStyles}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            {profInfo?.image ? (
                                <Image source={{uri: profInfo.image}} style={styles.avatar}/>
                            ) : (
                                <Image
                                    source={require("../assets/icons/user.png")}
                                    style={styles.avatar}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{stats.totalFormations}</Text>
                        <Text style={styles.statLabel}>Formations</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{stats.totalStudents}</Text>
                        <Text style={styles.statLabel}>Étudiants</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mes Formations</Text>
                        <TouchableOpacity
                            onPress={() => {
                                router.push("./profCourses");
                            }}
                        >
                            <Text style={styles.viewAll}>voir tout</Text>
                        </TouchableOpacity>
                    </View>

                    {formations.length > 0 ? (
                        formations
                            .map((item) => (
                                <FormationCard
                                    key={item.courseId}
                                    formation={item}
                                    onPress={(formation) => {
                                    }}
                                />
                            ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                Aucune formation disponible
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.addBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                            router.push("./addFormation");
                        }}
                    >
                        <Image source={Icons.plus} style={styles.addIconStyles}/>
                        <Text style={styles.addBtnText}>Ajouter une formation</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Activité étudiante</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>voir tout</Text>
                        </TouchableOpacity>
                    </View>

                    {activities.length > 0 ? (
                        activities.slice(0, 5).map((act) => {
                            let description = act.student.firstName + " " + act.student.lastName + " has subscribed to course " + act.course.title;
                            return (
                                <View key={act.student.id + act.course.id} style={styles.activityRow}>
                                    <Image source={Icons.avatar} style={styles.avatarStyles}/>
                                    <View style={styles.activityText}>
                                        <Text
                                            style={styles.activityContent}>{description}</Text>
                                        <Text style={styles.time}>{formatDate(act.enrollment.enrollmentDate)}</Text>
                                    </View>
                                </View>
                            );
                        })
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Aucune activité récente</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomMenu/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    welcome: {
        fontSize: 16,
        color: '#666'
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000'
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    notifCont: {
        padding: 5,
    },
    notifStyles: {
        width: 30,
        height: 30,
        marginRight: 10,
    },

    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#001f7f',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },

    section: {
        marginTop: 10,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222'
    },
    viewAll: {
        color: '#0033cc',
        fontSize: 14,
        fontWeight: '500',
    },

    addBtn: {
        backgroundColor: '#001f7f',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addIconStyles: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },

    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 10,
    },
    activityText: {
        marginLeft: 10,
        flex: 1,
    },
    activityContent: {
        color: '#333',
        fontSize: 14,
    },
    time: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    emptyStateText: {
        color: '#999',
        fontSize: 14,
    },
    avatarStyles: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
});