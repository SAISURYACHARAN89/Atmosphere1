import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { categories } from '../types';
import { styles } from '../styles';

interface FilterBarProps {
    selectedCategories: string[];
    onCategoryClick: (category: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    selectedCategories,
    onCategoryClick,
}) => {
    return (
        <>
            {/* Category Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => onCategoryClick(category)}
                        style={[
                            styles.categoryChip,
                            selectedCategories.includes(category) && styles.categoryChipActive
                        ]}
                    >
                        <Text style={[
                            styles.categoryChipText,
                            selectedCategories.includes(category) && styles.categoryChipTextActive
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Suggested for you heading */}
            <Text style={styles.suggestedHeading}>Suggested for you</Text>
        </>
    );
};
