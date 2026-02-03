import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    // Launch Meeting Button
    launchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 25,
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#040709',
        borderWidth: 1,
        borderColor: '#272727',
        borderRadius: 20,
    },
    launchBtnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    launchIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    launchBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 16,
        marginLeft: 10,
    },
    tabsRow: {
        flexDirection: 'row',
    },
    tabBtn: {
        marginRight: 20,
        paddingBottom: 12,
    },
    tabText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#fff',
    },
    tabUnderline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#fff',
    },
    searchIconBtn: {
        padding: 8,
    },
    // Search
    searchRow: {
        paddingHorizontal: 16,
        marginBottom: 12,
        position: 'relative',
    },
    searchInput: {
        backgroundColor: '#111',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingLeft: 30,
        paddingRight: 40,
        color: '#fff',
        fontSize: 15,
        marginVertical: 5,
        marginBottom: 12,
    },
    clearSearchBtn: {
        position: 'absolute',
        right: 28,
        top: 25,
    },
    // List
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Card specific styles
export const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#0d0d0d',
        borderWidth: 1,
        borderColor: '#272727',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 15,
    },
    cardRow1: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatarPlaceholder: {
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cardMiddle: {
        flex: 1,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 14.5,
        fontWeight: '500',
        marginBottom: 2,
    },
    hostRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hostText: {
        color: '#888',
        fontSize: 13,
    },
    joinBtn: {
        backgroundColor: '#2C2C2C',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 12,
    },
    joinBtnText: {
        color: '#fff',
        fontSize: 12.5,
        fontWeight: '600',
    },
    // Row 2
    cardRow2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    leftGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    eligibleBadge: {
        backgroundColor: '#0e2416',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    eligibleText: {
        color: '#22c55e',
        fontSize: 11,
        fontWeight: '500',
    },
    timeGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    participantsGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: '#666',
        fontSize: 11,
    },
    categoryBadge: {
        backgroundColor: '#0e1118',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        minWidth: 70,
        alignItems: 'center',
    },
    categoryText: {
        color: '#888',
        fontSize: 11.5,
    },
    // Expand
    expandRow: {
        alignItems: 'flex-start',
        paddingTop: 8,
    },
    expandedContent: {
        paddingTop: 8,
    },
    industryTags: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    industryTag: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    industryTagText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
    },
    descriptionText: {
        color: '#888',
        fontSize: 12,
        lineHeight: 18,
    },
});

// No meetings empty state styles
export const emptyStyles = StyleSheet.create({
    noMeetingsContainer: {
        padding: 48,
        alignItems: 'center',
    },
    noMeetingsText: {
        marginTop: 12,
        color: '#666',
        fontSize: 14,
    },
});

// Modal and form styles
export const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#111',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    modalForm: {
        padding: 16,
    },
    label: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 16,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 14,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
    },
    dateBtn: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: {
        color: '#fff',
        fontSize: 14,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    chip: {
        backgroundColor: '#22c55e',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipText: {
        color: '#fff',
        marginRight: 4,
        fontSize: 12,
    },
    searchResults: {
        backgroundColor: '#0a0a0a',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 150,
    },
    searchResultItem: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    searchResultText: {
        color: '#fff',
    },
    createBtn: {
        backgroundColor: '#fff',
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    createBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    // Type toggle buttons
    typeRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    typeBtn: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    typeBtnActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    typeBtnSmall: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    typeBtnText: {
        color: '#888',
        fontWeight: '500',
    },
    typeBtnTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    // Slider controls
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderLabel: {
        color: '#666',
        fontSize: 12,
        width: 24,
        textAlign: 'center',
    },
    sliderContainer: {
        flex: 1,
        height: 6,
        backgroundColor: '#1a1a1a',
        borderRadius: 3,
        marginHorizontal: 8,
    },
    sliderTrack: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 3,
    },
    sliderBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 12,
    },
    sliderBtn: {
        backgroundColor: '#1a1a1a',
        padding: 8,
        borderRadius: 6,
    },
    sliderValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'center',
    },
    // Checkbox
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    // Industry tags in form
    industriesScroll: {
        maxHeight: 80,
        marginBottom: 12,
    },
    formIndustryTag: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
    },
    formIndustryTagActive: {
        backgroundColor: '#22c55e',
    },
    formIndustryTagText: {
        color: '#888',
        fontSize: 12,
    },
    formIndustryTagTextActive: {
        color: '#fff',
    },
});
