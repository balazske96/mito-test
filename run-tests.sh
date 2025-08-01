#!/bin/bash

# Flight API Test Runner
# This script runs all HTTP test files against the backend API
# Note: Backend server must be running before executing this script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=4000
BACKEND_URL="http://localhost:$BACKEND_PORT"
TEST_DIR="tests"

echo -e "${BLUE}🚀 Flight API Test Runner${NC}"
echo "=================================="

# Function to check if backend is running
check_backend() {
    curl -s "$BACKEND_URL/health" > /dev/null 2>&1
    return $?
}

# Function to run HTTP tests using curl
run_http_tests() {
    local test_file=$1
    local test_name=$(basename "$test_file" .http)
    
    echo -e "${BLUE}🧪 Running $test_name tests...${NC}"
    echo "----------------------------------------"
    
    local passed=0
    local total=0
    local test_num=1
    
    # Parse the .http file and extract requests
    while IFS= read -r line; do
        # Skip comments and empty lines
        if [[ $line =~ ^[[:space:]]*$ ]] || [[ $line =~ ^[[:space:]]*# ]] || [[ $line =~ ^[[:space:]]*### ]]; then
            continue
        fi
        
        # Check if line starts with HTTP method
        if [[ $line =~ ^(GET|POST|PUT|DELETE|PATCH)[[:space:]]+ ]]; then
            total=$((total + 1))
            
            # Extract URL (replace {{baseUrl}} with actual URL)
            local url=$(echo "$line" | sed "s|{{baseUrl}}|$BACKEND_URL/api|g" | awk '{print $2}')
            local method=$(echo "$line" | awk '{print $1}')
            
            echo -n "  Test $test_num: $method $url ... "
            
            # Make the request
            local response_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" 2>/dev/null || echo "000")
            
            # Check if response is successful (2xx or 4xx for expected errors)
            if [[ $response_code =~ ^[24][0-9][0-9]$ ]]; then
                echo -e "${GREEN}✅ $response_code${NC}"
                passed=$((passed + 1))
            else
                echo -e "${RED}❌ $response_code${NC}"
            fi
            
            test_num=$((test_num + 1))
            
            # Small delay between requests
            sleep 0.1
        fi
    done < "$test_file"
    
    echo "----------------------------------------"
    if [ $passed -eq $total ]; then
        echo -e "${GREEN}✅ All $total tests passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  $passed/$total tests passed${NC}"
    fi
    echo ""
    
    return $((total - passed))
}

# Function to run a comprehensive test
run_comprehensive_test() {
    echo -e "${BLUE}🔍 Running comprehensive API test...${NC}"
    echo "----------------------------------------"
    
    # Test basic endpoints
    local endpoints=(
        "/health"
        "/"
        "/api/flights"
        "/api/stations"
        "/api/flights/route/BUD/LTN"
        "/api/stations/BUD"
        "/api/stations/BUD/connections"
    )
    
    local passed=0
    local total=${#endpoints[@]}
    
    for endpoint in "${endpoints[@]}"; do
        echo -n "  Testing $endpoint ... "
        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$endpoint" 2>/dev/null || echo "000")
        
        if [[ $response_code =~ ^[2][0-9][0-9]$ ]]; then
            echo -e "${GREEN}✅ $response_code${NC}"
            passed=$((passed + 1))
        else
            echo -e "${RED}❌ $response_code${NC}"
        fi
        
        sleep 0.1
    done
    
    echo "----------------------------------------"
    if [ $passed -eq $total ]; then
        echo -e "${GREEN}✅ All $total comprehensive tests passed!${NC}"
    else
        echo -e "${YELLOW}⚠️  $passed/$total comprehensive tests passed${NC}"
    fi
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}🏁 Starting test execution...${NC}"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -d "$TEST_DIR" ]; then
        echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
        echo "   Expected structure: $TEST_DIR/"
        exit 1
    fi
    
    # Check if backend is running
    echo -e "${YELLOW}🔍 Checking if backend is running on $BACKEND_URL...${NC}"
    if ! check_backend; then
        echo -e "${RED}❌ Backend is not running on $BACKEND_URL${NC}"
        echo -e "${YELLOW}💡 Please start the backend server first:${NC}"
        echo "   cd apps/backend && npm run dev"
        echo "   or"
        echo "   cd apps/backend && npm start"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Backend is running and accessible${NC}"
    echo ""
    
    # Run comprehensive test first
    run_comprehensive_test
    
    # Find and run all .http test files
    local total_failures=0
    local test_files=()
    
    # Collect all .http files
    while IFS= read -r -d '' file; do
        test_files+=("$file")
    done < <(find "$TEST_DIR" -name "*.http" -print0 | sort -z)
    
    if [ ${#test_files[@]} -eq 0 ]; then
        echo -e "${YELLOW}⚠️  No .http test files found in $TEST_DIR directory${NC}"
        exit 0
    fi
    
    echo -e "${BLUE}📋 Found ${#test_files[@]} test files${NC}"
    echo ""
    
    # Run each test file
    for test_file in "${test_files[@]}"; do
        run_http_tests "$test_file"
        total_failures=$((total_failures + $?))
    done
    
    # Summary
    echo "=================================="
    if [ $total_failures -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Flight API Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Prerequisites:"
    echo "  - Backend server must be running on $BACKEND_URL"
    echo "  - Start backend: cd apps/backend && npm run dev"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -p, --port     Backend port (default: $BACKEND_PORT)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests with default settings"
    echo "  $0 -p 3000           # Run tests against backend on port 3000"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--port)
            BACKEND_PORT="$2"
            BACKEND_URL="http://localhost:$BACKEND_PORT"
            shift 2
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main
